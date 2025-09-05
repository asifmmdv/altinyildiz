import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { data } from "../data/data";
import ProductCard from "../components/main/ProductCard"; // ⬅️ reuse your ProductCard

// helper: flatten all products to a map by id
function collectProducts(categories, out = {}) {
  for (const c of categories) {
    if (Array.isArray(c.products)) {
      for (const p of c.products) out[p.id] = p;
    }
    if (Array.isArray(c.subcategories)) collectProducts(c.subcategories, out);
  }
  return out;
}

export default function WishlistPage() {
  const { ids, clear } = useWishlist();
  const all = useMemo(() => collectProducts(data.categories), []);
  const items = ids.map((id) => all[id]).filter(Boolean);

  return (
    <div className="w-full max-tablet-lg:max-w-[640px] max-laptop:max-w-[768px] max-tablet:px-5 max-desktop:max-w-[984px] mx-auto max-desktop-lg:max-w-[1210px] max-desktop-xl:max-w-[1330px] desktop-xl:max-w-[1430px] pb-[88px] tablet-lg:pb-0 overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl max-tablet:text-[14px] font-medium">Favorilerim ({items.length})</h1>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="text-sm underline hover:text-red-500 transition cursor-pointer"
          >
            Hepsini sil
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-600 mb-4">Favorileriniz yok</p>
          <Link to="/" className="underline">
            Ana Sayfa
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-4">
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group block"
            >
              <ProductCard product={p} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}