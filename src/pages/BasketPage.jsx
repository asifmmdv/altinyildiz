import React from "react";
import { useBasket } from "../context/BasketContext";
import { Link } from "react-router-dom";

export default function BasketPage() {
  const basket = useBasket();
  const lines = Object.values(basket.items);

  if (!lines.length) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">Sepet</h1>
        <p className="text-gray-600">Sepetiniz boş.</p>
        <Link to="/" className="inline-block mt-4 underline">Alışverişe devam et</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 grid grid-cols-1 laptop:grid-cols-3 gap-8">
      <div className="laptop:col-span-2">
        <h1 className="text-2xl font-semibold mb-4">Sepet</h1>
        <ul className="divide-y">
          {lines.map((l) => (
            <li key={l.key} className="py-4 flex gap-4 items-center">
              <img src={l.image} alt={l.name} className="w-20 h-24 object-contain bg-neutral-100 rounded" />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium line-clamp-2">{l.name}</p>
                    <div className="text-xs text-gray-500 mt-1 flex gap-3">
                      {l.size && <span>Beden: {l.size}</span>}
                      {l.color && <span>Renk: {l.color}</span>}
                    </div>
                  </div>
                  <button onClick={() => basket.remove(l.key)} className="text-sm underline">Kaldır</button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border rounded-full overflow-hidden">
                    <button onClick={() => basket.updateQty(l.key, l.qty - 1)} className="px-3 py-1">-</button>
                    <span className="px-4 text-sm select-none">{l.qty}</span>
                    <button onClick={() => basket.updateQty(l.key, l.qty + 1)} className="px-3 py-1">+</button>
                  </div>
                  <div className="text-sm font-semibold">{basket.format(l.price * l.qty)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="laptop:col-span-1 h-max sticky top-24 border rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">Özet</h2>
        <div className="flex justify-between text-sm mb-2">
          <span>Ara Toplam</span>
          <span>{basket.format(basket.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span>Kargo</span>
          <span>Kasada hesaplanır</span>
        </div>
        <div className="flex justify-between text-base font-semibold mb-4">
          <span>Toplam</span>
          <span>{basket.format(basket.total)}</span>
        </div>
        <button className="w-full py-3 rounded-xl bg-black text-white">Ödeme yap</button>
        <button onClick={basket.clear} className="w-full py-2 mt-3 text-sm underline">Sepeti temizle</button>
      </aside>
    </div>
  );
}