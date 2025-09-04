// src/pages/ProductPage.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { data } from "../data/data";
import ProductCard from "../components/main/ProductCard";
import { ImEqualizer2 } from "react-icons/im";

// ---------- Helpers ----------
function findNodeBySlug(categories, slug) {
  for (const cat of categories) {
    if (cat.slug === slug) return cat;
    if (cat.subcategories) {
      const found = findNodeBySlug(cat.subcategories, slug);
      if (found) return found;
    }
  }
  return null;
}

function findPathToSlug(categories, slug, trail = []) {
  for (const cat of categories) {
    const nextTrail = [...trail, { name: cat.name, slug: cat.slug }];
    if (cat.slug === slug) return nextTrail;
    if (Array.isArray(cat.subcategories)) {
      const found = findPathToSlug(cat.subcategories, slug, nextTrail);
      if (found) return found;
    }
  }
  return null;
}

function collectAllProducts(node, out = []) {
  if (!node) return out;
  if (Array.isArray(node.products)) out.push(...node.products);
  if (Array.isArray(node.subcategories)) {
    for (const sub of node.subcategories) collectAllProducts(sub, out);
  }
  return out;
}

// Parse "1.299,99 TL" -> 1299.99
function parsePrice(priceStr) {
  if (!priceStr || typeof priceStr !== "string") return Number.POSITIVE_INFINITY;
  const cleaned = priceStr
    .replace(/\s/g, "")
    .replace(/[^\d.,]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : Number.POSITIVE_INFINITY;
}

function avgRating(reviews = []) {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return sum / reviews.length;
}

// ---------- Small reusable label ----------
function SortLabel({ text = "Sırala:" }) {
  return (
    <div className="flex gap-1 items-center">
      <ImEqualizer2 className="rotate-90 text-gray-500" />
      <span className="text-[16px]">{text}</span>
    </div>
  );
}

// ---------- Desktop/Tablet-lg custom dropdown ----------
const SORT_OPTIONS = [
  { value: "editor", label: "Editör sıralaması" },
  { value: "price-asc", label: "Fiyata göre artan" },
  { value: "price-desc", label: "Fiyata göre azalan" },
  { value: "rating-desc", label: "En değerlendirilen" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) close();
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, close]);

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const choose = (val) => {
    onChange(val);
    close();
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 bg-white text-xs tablet:text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <SortLabel />
        <span className="text-gray-900">{current.label}</span>
        {/* caret */}
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M5 7l5 6 5-6H5z" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-64 rounded-xl border border-black/5 bg-white shadow-lg ring-1 ring-black/5 p-1"
        >
          {SORT_OPTIONS.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={active}
                onClick={() => choose(opt.value)}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-50 ${
                  active ? "font-medium" : "font-normal"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`h-4 w-4 rounded-full border ${
                    active ? "bg-black border-black" : "border-gray-300"
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- Page ----------
export default function ProductPage() {
  const { slug } = useParams();

  const node = findNodeBySlug(data.categories, slug);
  const path = findPathToSlug(data.categories, slug) || [];
  const products = collectAllProducts(node, []);

  // Sorting state
  const [sortKey, setSortKey] = useState("editor"); // 'editor' | 'price-asc' | 'price-desc' | 'rating-desc'

  const sortedProducts = useMemo(() => {
    const arr = [...products];
    switch (sortKey) {
      case "price-asc":
        arr.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-desc":
        arr.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "rating-desc":
        arr.sort((a, b) => {
          const ar = avgRating(a.reviews);
          const br = avgRating(b.reviews);
          if (br !== ar) return br - ar;
          const ac = Array.isArray(a.reviews) ? a.reviews.length : 0;
          const bc = Array.isArray(b.reviews) ? b.reviews.length : 0;
          if (bc !== ac) return bc - ac;
          return parsePrice(a.price) - parsePrice(b.price);
        });
        break;
      case "editor":
      default:
        // Keep natural order from data.js
        break;
    }
    return arr;
  }, [products, sortKey]);

  // ---------- Bottom Sheet (≤ tablet-lg) ----------
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);
  const openSheet = useCallback(() => setIsSheetOpen(true), []);

  // Close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeSheet();
    }
    if (isSheetOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSheetOpen, closeSheet]);

  // Prevent body scroll while sheet is open
  useEffect(() => {
    if (!isSheetOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isSheetOpen]);

  // Apply sort + close for sheet
  const chooseSort = (key) => {
    setSortKey(key);
    closeSheet();
  };

  return (
    <div className="w-full max-tablet-lg:max-w-[640px] max-tablet:px-2 max-laptop:max-w-[768px] max-desktop:max-w-[984px] mx-auto max-desktop-lg:max-w-[1210px] max-desktop-xl:max-w-[1330px] desktop-xl:max-w-[1430px] tablet-lg:pb-0">
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-500 my-3 flex px-2 flex-wrap gap-1">
        <Link to="/" className="hover:underline">Anasayfa</Link>
        {path.map((segment, idx) => (
          <React.Fragment key={segment.slug}>
            <span>/</span>
            {idx < path.length - 1 ? (
              <Link to={`/products/${segment.slug}`} className="hover:underline">
                {segment.name}
              </Link>
            ) : (
              <span className="text-gray-700">{segment.name}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Sort toolbar */}
      <div className="px-2 mb-3 flex items-center justify-between">
        <p className="text-xs tablet:text-sm text-gray-600 hidden">
          {products.length} ürün
        </p>

        {/* Desktop/large: label + custom dropdown */}
        <div className="hidden tablet-lg:flex items-center gap-2">
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>

        {/* ≤ tablet-lg: trigger button styled like the label */}
        <button
          type="button"
          onClick={openSheet}
          className="tablet-lg:hidden rounded-md px-3 py-1 bg-white flex items-center gap-2"
          aria-haspopup="dialog"
          aria-expanded={isSheetOpen}
          aria-controls="sort-bottom-sheet"
        >
          <SortLabel />
        </button>
      </div>

      {/* Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-sm text-gray-600 px-2">
          Bu kategori için ürün bulunamadı.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 laptop:grid-cols-4 px-2">
          {sortedProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block">
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}

      {/* ----- Bottom Sheet + Backdrop (≤ tablet-lg) ----- */}
      {/* Backdrop */}
      <div
        className={`tablet-lg:hidden fixed inset-0 bg-black/40 transition-opacity duration-200 z-[999] ${
          isSheetOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSheet}
      />

      {/* Sheet */}
      <section
        id="sort-bottom-sheet"
        role="dialog"
        aria-modal="true"
        className={`tablet-lg:hidden fixed inset-x-0 bottom-0 z-[9999] bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ${
          isSheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "33vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center py-2">
          <span className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="px-4 pb-4">
          <div className="text-center py-3">Sıralama</div>

          {/* No borders between items */}
          <ul className="rounded-lg overflow-hidden">
            <SheetItem
              label="Editör sıralaması"
              active={sortKey === "editor"}
              onClick={() => chooseSort("editor")}
            />
            <SheetItem
              label="Fiyata göre artan"
              active={sortKey === "price-asc"}
              onClick={() => chooseSort("price-asc")}
            />
            <SheetItem
              label="Fiyata göre azalan"
              active={sortKey === "price-desc"}
              onClick={() => chooseSort("price-desc")}
            />
            <SheetItem
              label="En değerlendirilen"
              active={sortKey === "rating-desc"}
              onClick={() => chooseSort("rating-desc")}
            />
          </ul>
        </div>
      </section>
    </div>
  );
}

/** Row component used inside the bottom sheet */
function SheetItem({ label, active, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm ${
          active ? "bg-gray-50 font-medium" : "bg-white"
        }`}
      >
        <span>{label}</span>
        {/* radio indicator */}
        <span
          className={`inline-block h-4 w-4 rounded-full border ${
            active ? "bg-black border-black" : "border-gray-300"
          }`}
          aria-hidden
        />
      </button>
    </li>
  );
}