import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const BasketContext = createContext(null);

// --- helpers ---
const STORAGE_KEY = "basket_v1";
const lineKey = (id, size, color) => [id, size || "-", color || "-"].join("::");

export const parsePrice = (price) => {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const cleaned = String(price)
    .replace(/[^0-9.,]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(/,(?=\d{3}(\D|$))/g, "");
  const normalized = cleaned.replace(",", ".");
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
};

const formatTRY = (n) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(n || 0);

const initialState = {
  items: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return action.payload || initialState;
    }
    case "ADD": {
      const { id, name, price, image, size, color, qty = 1 } = action.payload;
      const key = lineKey(id, size, color);
      const existing = state.items[key];
      const nextQty = (existing?.qty || 0) + qty;
      return { ...state, items: { ...state.items, [key]: { key, id, name, price, image, size, color, qty: nextQty } } };
    }
    case "UPDATE_QTY": {
      const { key, qty } = action.payload;
      if (!state.items[key]) return state;
      if (qty <= 0) {
        const { [key]: _, ...rest } = state.items;
        return { ...state, items: rest };
      }
      return { ...state, items: { ...state.items, [key]: { ...state.items[key], qty } } };
    }
    case "REMOVE": {
      const { key } = action.payload;
      const { [key]: _, ...rest } = state.items;
      return { ...state, items: rest };
    }
    case "CLEAR": {
      return initialState;
    }
    default:
      return state;
  }
}

export function BasketProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "INIT", payload: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const totals = useMemo(() => {
    const lines = Object.values(state.items);
    const subtotal = lines.reduce((sum, l) => sum + (l.price || 0) * l.qty, 0);
    return { count: lines.reduce((c, l) => c + l.qty, 0), subtotal, total: subtotal };
  }, [state.items]);

  const api = useMemo(() => ({
    items: state.items,
    ...totals,
    add: (product, { qty = 1, size, color } = {}) => {
      const { id, name, images, price } = product;
      const image = images?.[0];
      dispatch({ type: "ADD", payload: { id, name, price: parsePrice(price), image, size, color, qty } });
    },
    updateQty: (key, qty) => dispatch({ type: "UPDATE_QTY", payload: { key, qty } }),
    remove: (key) => dispatch({ type: "REMOVE", payload: { key } }),
    clear: () => dispatch({ type: "CLEAR" }),
    format: formatTRY,
    lineKey,
  }), [state.items, totals]);

  return <BasketContext.Provider value={api}>{children}</BasketContext.Provider>;
}

export const useBasket = () => {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
};
