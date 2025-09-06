import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { data } from "../data/data";
import ProductCard from "../components/main/ProductCard";

const collectProducts = (cats, out = {}) => {
  cats.forEach((c) => {
    c.products?.forEach((p) => (out[p.id] = p));
    c.subcategories && collectProducts(c.subcategories, out);
  });
  return out;
};

export default function WishlistPage() {
  const { ids, clear } = useWishlist();
  const all = useMemo(() => collectProducts(data.categories), []);
  const items = ids.map((id) => all[id]).filter(Boolean);

  if (!items.length)
    return (
      <div className="w-full mx-auto max-w-[1330px] pb-[88px] tablet-lg:pb-0 px-5 text-center">
        <h1 className="text-xl font-medium mb-4">Favorilerim (0)</h1>
        <p className="text-gray-600 mb-7 text-[20px]">Favorileriniz yok</p>
        <Link to="/" className="bg-black text-white rounded-lg px-4 py-3 text-sm font-medium">
          Ana Sayfa
        </Link>
      </div>
    );

  return (
    <div className="w-full mx-auto max-w-[1330px] pb-[88px] tablet-lg:pb-0 px-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">Favorilerim ({items.length})</h1>
        <button onClick={clear} className="text-[14px] tablet:text-[16px] hover:text-red-500">
          Hepsini sil
        </button>
      </div>
      <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="group block">
            <ProductCard product={p} />
          </Link>
        ))}
      </div>
    </div>
  );
}