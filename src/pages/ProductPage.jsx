// src/pages/ProductPage.jsx
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { data } from "../data/data";
import ProductCard from "../components/main/ProductCard";
import { ImEqualizer2 } from "react-icons/im";
import { CiGrid2V } from "react-icons/ci";
import { TfiLayoutGrid3, TfiLayoutGrid4 } from "react-icons/tfi";

/* ---------- helpers ---------- */
const findNodeBySlug = (cats, slug) => {
  for (const c of cats) {
    if (c.slug === slug) return c;
    if (c.subcategories) {
      const hit = findNodeBySlug(c.subcategories, slug);
      if (hit) return hit;
    }
  }
  return null;
};
const findPathToSlug = (cats, slug, trail = []) => {
  for (const c of cats) {
    const next = [...trail, { name: c.name, slug: c.slug }];
    if (c.slug === slug) return next;
    if (c.subcategories) {
      const hit = findPathToSlug(c.subcategories, slug, next);
      if (hit) return hit;
    }
  }
  return null;
};
const collectAllProducts = (node, out = []) => {
  if (!node) return out;
  if (node.products) out.push(...node.products);
  if (node.subcategories) node.subcategories.forEach((s) => collectAllProducts(s, out));
  return out;
};
const parsePrice = (s) => {
  if (!s) return Number.POSITIVE_INFINITY;
  const cleaned = s
    .replace(/\s/g, "")
    .replace(/[^\d.,]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
};
const avgRating = (r = []) => (r.length ? r.reduce((a, x) => a + (+x.rating || 0), 0) / r.length : 0);

/* ---------- tiny ui ---------- */
const SortLabel = ({ text = "Sırala:" }) => (
  <span className="inline-flex items-center gap-1">
    <ImEqualizer2 className="rotate-90 text-gray-500" />
    <span className="text-[16px]">{text}</span>
  </span>
);

const SORTS = [
  { value: "editor", label: "Editör sıralaması" },
  { value: "price-asc", label: "Fiyata göre artan" },
  { value: "price-desc", label: "Fiyata göre azalan" },
  { value: "rating-desc", label: "En değerlendirilen" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SORTS.find((o) => o.value === value) || SORTS[0];
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && close();
    const k = (e) => e.key === "Escape" && close();
    if (open) {
      document.addEventListener("mousedown", h);
      window.addEventListener("keydown", k);
    }
    return () => {
      document.removeEventListener("mousedown", h);
      window.removeEventListener("keydown", k);
    };
  }, [open, close]);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 bg-white text-xs tablet:text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <SortLabel />
        <span className="text-gray-900">{current.label}</span>
        <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M5 7l5 6 5-6H5z" />
        </svg>
      </button>

      {open && (
        <div role="listbox" className="absolute z-50 mt-2 w-64 rounded-xl border border-black/5 bg-white shadow-lg ring-1 ring-black/5 p-1">
          {SORTS.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(o.value);
                  close();
                }}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-50 ${
                  active ? "font-medium" : ""
                }`}
              >
                <span>{o.label}</span>
                <span className={`h-4 w-4 rounded-full border ${active ? "bg-black border-black" : "border-gray-300"}`} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ListSidebar({ categories, activePathSlugs, expandedSlugs }) {
  const items = useMemo(() => {
    const out = [];
    (categories || []).forEach((n) => {
      const isKoleksiyon = n.slug === "koleksiyon" || /^koleksi/i.test(n.name || "");
      if (isKoleksiyon && n.subcategories) out.push(...n.subcategories);
      else out.push(n);
    });
    return out;
  }, [categories]);

  return (
    <aside className="hidden laptop:block">
      <ul className="flex flex-col gap-1">
        {items.map((n) => (
          <SidebarNode key={n.slug} node={n} activePathSlugs={activePathSlugs} expandedSlugs={expandedSlugs} level={0} />
        ))}
      </ul>
    </aside>
  );
}

function SidebarNode({ node, activePathSlugs, expandedSlugs, level }) {
  const isActive = activePathSlugs?.has(node.slug);
  const isExpanded = expandedSlugs?.has(node.slug);
  const hasChildren = Array.isArray(node.subcategories) && node.subcategories.length;
  const rootText = level === 0 ? "text-[18px] font-bold" : "text-sm";

  return (
    <li>
      <Link
        to={`/products/${node.slug}`}
        className={`relative inline-block ${rootText} ${level === 0 ? "px-3 py-2" : "px-3 py-1.5"} text-gray-700
          after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-black after:w-0
          after:transition-all after:duration-300 hover:after:w-full ${
            isActive ? "font-semibold text-gray-900 after:w-full" : ""
          }`}
      >
        {node.name}
      </Link>

      {hasChildren && (
        <ul
          className={`ml-3 pl-3 flex flex-col gap-1 transition-[max-height] duration-200 ease-out ${
            isExpanded ? "max-h-[2000px]" : "max-h-0 overflow-hidden"
          }`}
        >
          {node.subcategories.map((ch) => (
            <SidebarNode
              key={ch.slug}
              node={ch}
              activePathSlugs={activePathSlugs}
              expandedSlugs={expandedSlugs}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

const SheetItem = ({ label, active, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 text-sm ${active ? "bg-gray-50 font-medium" : "bg-white"}`}
    >
      <span>{label}</span>
      <span className={`inline-block h-4 w-4 rounded-full border ${active ? "bg-black border-black" : "border-gray-300"}`} />
    </button>
  </li>
);

/* ---------- page ---------- */
export default function ProductPage() {
  const { slug } = useParams();
  const node = findNodeBySlug(data.categories, slug);
  const path = findPathToSlug(data.categories, slug) || [];
  const products = collectAllProducts(node, []);
  const activePathSlugs = useMemo(() => new Set(path.map((p) => p.slug)), [path]);

  const [sortKey, setSortKey] = useState("editor");

  // 👇 Grid view: 2 / 3 / 4 columns
  const [gridCols, setGridCols] = useState(3);
  const gridClass = useMemo(() => {
    switch (gridCols) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2 tablet:grid-cols-3";
      case 4:
      default:
        return "grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4";
    }
  }, [gridCols]);

  const sortedProducts = useMemo(() => {
    const arr = [...products];
    if (sortKey === "price-asc") arr.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    else if (sortKey === "price-desc") arr.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    else if (sortKey === "rating-desc")
      arr.sort((a, b) => {
        const ar = avgRating(a.reviews),
          br = avgRating(b.reviews);
        if (br !== ar) return br - ar;
        const ac = a.reviews?.length || 0,
          bc = b.reviews?.length || 0;
        if (bc !== ac) return bc - ac;
        return parsePrice(a.price) - parsePrice(b.price);
      });
    return arr;
  }, [products, sortKey]);

  // bottom sheet state
  const [sheet, setSheet] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);
  const openSheet = useCallback(() => setSheet(true), []);
  useEffect(() => {
    const k = (e) => e.key === "Escape" && closeSheet();
    if (sheet) window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [sheet, closeSheet]);
  useEffect(() => {
    if (!sheet) return;
    const o = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = o);
  }, [sheet]);

  return (
    <div className="w-full max-tablet-lg:max-w-[640px] max-tablet:px-2 max-laptop:max-w-[768px] max-desktop:max-w-[984px] mx-auto max-desktop-lg:max-w-[1210px] max-desktop-xl:max-w-[1330px] desktop-xl:max-w-[1430px] tablet-lg:pb-0">
      {/* breadcrumbs */}
      <nav className="text-xs text-gray-500 my-3 flex px-2 flex-wrap gap-1">
        <Link to="/" className="hover:underline">Anasayfa</Link>
        {path.map((seg, i) => (
          <React.Fragment key={seg.slug}>
            <span>/</span>
            {i < path.length - 1 ? (
              <Link to={`/products/${seg.slug}`} className="hover:underline">{seg.name}</Link>
            ) : (
              <span className="text-gray-700">{seg.name}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* toolbar (mobile sheet trigger) */}
      <div className="px-2 flex items-center justify-between">
        <button
          onClick={openSheet}
          className="tablet-lg:hidden rounded-md px-3 py-1 bg-white flex items-center gap-2"
          aria-haspopup="dialog"
          aria-expanded={sheet}
          aria-controls="sort-bottom-sheet"
        >
          <SortLabel />
        </button>
      </div>

      {/* layout */}
      <div className="px-2 laptop:px-0">
        <div className="laptop:flex laptop:gap-6">
          {/* left sidebar */}
          <div className="laptop:w-1/4 laptop:sticky laptop:top-24 laptop:self-start">
            <ListSidebar
              categories={data.categories}
              activePathSlugs={activePathSlugs}
              expandedSlugs={activePathSlugs}
            />
          </div>

          {/* right content */}
          <div className="laptop:w-3/4">
            <div className="flex gap-4 items-center mb-4">
              <div className="tablet-lg:flex hidden items-center gap-2">
                <SortDropdown value={sortKey} onChange={setSortKey} />
              </div>

              {/* grid view toggles */}
              <div className="laptop:flex hidden gap-2 items-center">
                <span className="text-[16px]">Görünüm</span>
                <CiGrid2V
                  title="2 sütun"
                  onClick={() => setGridCols(2)}
                  className={`w-[24px] h-[24px] cursor-pointer ${gridCols === 2 ? "text-black" : "text-gray-400"}`}
                />
                <TfiLayoutGrid3
                  title="3 sütun"
                  onClick={() => setGridCols(3)}
                  className={`w-[18px] h-[18px] cursor-pointer ${gridCols === 3 ? "text-black" : "text-gray-400"}`}
                />
                <TfiLayoutGrid4
                  title="4 sütun"
                  onClick={() => setGridCols(4)}
                  className={`w-[20px] h-[20px] cursor-pointer ${gridCols === 4 ? "text-black" : "text-gray-400"}`}
                />
              </div>
            </div>

            {sortedProducts.length ? (
              <div className={`grid gap-4 ${gridClass}`}>
                {sortedProducts.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="block">
                    <ProductCard product={p} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Bu kategori için ürün bulunamadı.</p>
            )}
          </div>
        </div>
      </div>

      {/* sheet backdrop */}
      <div
        className={`tablet-lg:hidden fixed inset-0 bg-black/40 transition-opacity duration-200 z-[999] ${
          sheet ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSheet}
      />
      {/* bottom sheet */}
      <section
        id="sort-bottom-sheet"
        role="dialog"
        aria-modal="true"
        className={`tablet-lg:hidden fixed inset-x-0 bottom-0 z-[9999] bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ${
          sheet ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "33vh" }}
      >
        <div className="flex justify-center py-2">
          <span className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-center py-3">Sıralama</div>
          <ul className="rounded-lg overflow-hidden">
            <SheetItem label="Editör sıralaması" active={sortKey === "editor"} onClick={() => setSortKey("editor")} />
            <SheetItem label="Fiyata göre artan" active={sortKey === "price-asc"} onClick={() => setSortKey("price-asc")} />
            <SheetItem label="Fiyata göre azalan" active={sortKey === "price-desc"} onClick={() => setSortKey("price-desc")} />
            <SheetItem label="En değerlendirilen" active={sortKey === "rating-desc"} onClick={() => setSortKey("rating-desc")} />
          </ul>
        </div>
      </section>
    </div>
  );
}