// src/pages/BasketPage.jsx
import React, { useState } from "react";
import { useBasket } from "../context/BasketContext";
import { Link } from "react-router-dom";
import { GoTrash, GoChevronDown } from "react-icons/go";

/* ---------- Custom Qty Dropdown ---------- */
function QtyDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block min-w-[140px]">
      <button
        type="button"
        className="w-full border rounded-md px-3 py-2 cursor-pointer text-[12px] laptop:text-[14px] bg-white flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        {value} Adet
        <GoChevronDown
          className={`ml-2 h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
          {options.map((q) => (
            <li
              key={q}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(q);
                setOpen(false);
              }}
            >
              {q} Adet
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Basket Page ---------- */
export default function BasketPage() {
  const basket = useBasket();
  const lines = Object.values(basket.items || {});
  const itemCount = lines.reduce((sum, l) => sum + (l.qty || 0), 0);

  if (!lines.length) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 flex flex-col items-center gap-5 py-10 justify-center">
        <p className="text-gray-600 text-center">Sepetiniz boş.</p>
        <Link
          to="/"
          className="rounded-xl flex justify-center items-center bg-black text-white"
        >
          <span className="p-3">Ana Sayfa</span>
        </Link>
      </div>
    );
  }

  const qtyOptions = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <div className="w-full max-tablet-lg:max-w-[640px] max-laptop:max-w-[768px] max-tablet:px-5 max-desktop:max-w-[984px] mx-auto max-desktop-lg:max-w-[1210px] max-desktop-xl:max-w-[1330px] desktop-xl:max-w-[1430px] pb-[88px] tablet-lg:pb-0 overflow-visible grid grid-cols-1 laptop:grid-cols-3 gap-8">
      {/* Left: Lines */}
      <div className="laptop:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-[14px] tablet:text-2xl font-medium">Sepetim</h1>
          <span className="text-[14px] tablet:text-2xl font-medium">
            ({itemCount})
          </span>
        </div>

        <ul>
          {lines.map((l, idx) => {
            const compareAt =
              l.compareAt ?? l.retailPrice ?? l.originalPrice ?? null;
            const productHref = l.href ?? (l.id ? `/product/${l.id}` : "#");

            return (
              <li
                key={l.key}
                className={`js-cart-line-item py-4 h-[185px] laptop:h-[353px] flex gap-4 items-start ${
                  idx !== lines.length - 1
                    ? "border-b border-[rgb(238,238,237)]"
                    : ""
                }`}
              >
                {/* Image */}
                <div className="shrink-0">
                  <Link to={productHref} className="block">
                    <img
                      src={l.image}
                      alt={l.name}
                      title={`${l.name} için ayrıntıları göster`}
                      className="w-[96px] h-[144px] laptop:h-[288px] laptop:w-[192px] object-contain bg-neutral-100 rounded"
                      loading="lazy"
                    />
                  </Link>
                </div>

                {/* Details */}
                <div className="item-details flex-1 w-full">
                  <header className="flex items-start justify-between gap-4">
                    <h4 className="item-name max-tablet:text-[12px] text-sm font-medium leading-snug max-w-[560px]">
                      <Link to={productHref}>{l.name}</Link>
                    </h4>

                    {/* Prices */}
                    <div className="prices text-right shrink-0">
                      {compareAt ? (
                        <div className="flex items-center gap-2">
                          <span className="retail-price line-through text-gray-400 text-[12px] text-sm laptop:text-[14px]">
                            {basket.format(compareAt)}
                          </span>
                          <span className="price font-semibold text-[12px] laptop:text-[14px]">
                            {basket.format(l.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="price font-semibold text-[12px] laptop:text-[14px]">
                          {basket.format(l.price)}
                        </span>
                      )}
                    </div>
                  </header>

                  {/* Attributes */}
                  <div className="w-full mt-1 text-[12px] laptop:text-[14px] text-gray-600">
                    <div className="item-attributes leading-5">
                      {l.color && (
                        <>
                          Renk: {l.color}
                          <br />
                        </>
                      )}
                      {l.size && <>Beden: {l.size}</>}
                    </div>
                  </div>

                  {/* Footer: Qty dropdown + Remove */}
                  <footer className="mt-3 flex items-center justify-between">
                    {/* Custom Qty Dropdown */}
                    <QtyDropdown
                      value={l.qty}
                      options={qtyOptions}
                      onChange={(newQty) =>
                        basket.updateQty(l.key, parseInt(newQty, 10))
                      }
                    />

                    {/* Remove button (icon-only) */}
                    <button
                      type="button"
                      onClick={() => basket.remove(l.key)}
                      className="js-basket-remove-btn inline-flex cursor-pointer items-center justify-center text-sm w-10 h-10 rounded-xl bg-[rgb(238,238,237)]"
                      aria-label="Kaldır"
                      title="Kaldır"
                    >
                      <GoTrash className="w-5 h-5" />
                    </button>
                  </footer>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right: Summary */}
      <aside className="laptop:col-span-1 h-max sticky top-24 p-5">
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

        <button className="w-full py-3 rounded-xl bg-black text-white cursor-pointer">
          Ödeme yap
        </button>

        <button
          onClick={basket.clear}
          className="w-full py-2 mt-3 text-sm underline cursor-pointer"
        >
          Sepeti temizle
        </button>
      </aside>
    </div>
  );
}