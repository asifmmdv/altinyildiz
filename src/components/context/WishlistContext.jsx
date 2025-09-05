import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem("wishlist_ids");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist_ids", JSON.stringify(ids));
  }, [ids]);

  const add = useCallback((id) => setIds((prev) => prev.includes(id) ? prev : [...prev, id]), []);
  const remove = useCallback((id) => setIds((prev) => prev.filter((x) => x !== id)), []);
  const toggle = useCallback((id) => setIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]), []);
  const isWished = useCallback((id) => ids.includes(id), [ids]);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(() => ({ ids, add, remove, toggle, isWished, clear, count: ids.length }), [ids, add, remove, toggle, isWished, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}