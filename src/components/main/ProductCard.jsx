import React, { useMemo, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";

const PAGE_SIZE = 4;

const ProductCard = ({ product, onAddToCart }) => {
  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [page, setPage] = useState(0);

  // ❤️ wishlist
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.id);

  // sizes source (fallbacks)
  const rawSizes =
    product.sizes ||
    product.variants?.sizes ||
    product.variants?.map((v) => v.size) ||
    [];

  // normalize sizes into { label, disabled }
  const sizes = useMemo(
    () =>
      rawSizes.map((s) =>
        typeof s === "string"
          ? { label: s, disabled: false }
          : {
              label: s?.label || s?.size || String(s),
              disabled: Boolean(s?.disabled || s?.stock === 0),
            }
      ),
    [rawSizes]
  );

  // pagination
  const totalPages = Math.max(1, Math.ceil(sizes.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const visible = sizes.slice(
    clampedPage * PAGE_SIZE,
    clampedPage * PAGE_SIZE + PAGE_SIZE
  );

  const handleMouseMove = (e) => {
    if (!hovered || !product.images || window.innerWidth < 1024) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const percent = x / width;
    const idx = Math.min(
      product.images.length - 1,
      Math.max(0, Math.floor(percent * product.images.length))
    );
    if (idx !== imageIndex) setImageIndex(idx);
  };

  const nudge = (dir = 1) => {
    setPage((p) => Math.min(Math.max(p + dir, 0), totalPages - 1));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = { product, size: selectedSize };
    if (onAddToCart) onAddToCart(payload);
    else console.log("Add to cart:", payload);
  };

  return (
    <div
      className="cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setImageIndex(0);
        // keep selectedSize; button will hide with hover out
      }}
    >
      <div className="relative overflow-hidden" onMouseMove={handleMouseMove}>
        {/* ❤️ Heart icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          className="absolute top-2 right-2 z-20 bg-[rgb(238,238,237)] rounded-full p-2"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wished ? (
            <FaHeart className="text-red-500 w-4 h-4" />
          ) : (
            <FaRegHeart className="text-gray-700 w-4 h-4" />
          )}
        </button>

        {/* Main product image */}
        <img
          src={product.images?.[imageIndex] || product.images?.[0]}
          alt={product.name}
          className="object-contain w-full transition duration-300"
        />

        {/* --- Line indicators --- */}
        {product.images?.length > 1 && (
          <div className="hidden laptop:flex absolute bottom-0 left-0 right-0 items-center bg-white/90 h-4 justify-center gap-1 z-10">
            {product.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-[5px] flex-1 transition ${
                  idx === imageIndex
                    ? "bg-[rgb(102,102,102)]"
                    : "bg-[rgb(176,175,175)]"
                }`}
              />
            ))}
          </div>
        )}

        {/* ===== Hover Sizes Rail (4-per-view) ===== */}
        {sizes.length > 0 && (
          <div
            className="
              hidden laptop:block
              absolute left-0 right-0 bottom-2 z-20
              transition-transform duration-300 ease-out
              translate-y-full group-hover:translate-y-0
            "
            onMouseMove={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[rgba(238,238,238,0.83)] backdrop-blur-sm border-t border-gray-200">
              <div className="relative px-10 pt-3 pb-2">
                {/* 4-per-view grid */}
                <div className="grid grid-cols-4 gap-2">
                  {visible.map(({ label, disabled }, i) => (
                    <button
                      key={`${label}-${i}-${clampedPage}`}
                      disabled={disabled}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!disabled) setSelectedSize(label);
                      }}
                      className={`min-w-[44px] whitespace-nowrap h-9 px-2 text-[10px] cursor-pointer rounded
                        ${
                          disabled
                            ? "border border-gray-200 text-gray-300 line-through"
                            : selectedSize === label
                            ? "bg-black text-white"
                            : "text-gray-800 "
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* arrows (page by 4) */}
                {totalPages > 1 && (
                  <>
                    <button
                      aria-label="Previous sizes"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nudge(-1);
                      }}
                      disabled={clampedPage === 0}
                      className={`absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center ${
                        clampedPage === 0 ? "opacity-40" : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4">
                        <path
                          d="M15 18l-6-6 6-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                    <button
                      aria-label="Next sizes"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nudge(1);
                      }}
                      disabled={clampedPage === totalPages - 1}
                      className={`absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center ${
                        clampedPage === totalPages - 1 ? "opacity-40" : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4">
                        <path
                          d="M9 6l6 6-6 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* === Add-to-cart bar (appears only when a size is selected) === */}
                <div
                  className={`
                    overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out
                    ${selectedSize ? "max-h-16 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"}
                  `}
                >
                  <div className="pt-2">
                    <button
                      onClick={handleAddToCart}
                      className="w-full h-10 rounded-md bg-black text-white text-xs cursor-pointer font-semibold tracking-wide">
                      Sebete Ekle
                    </button>
                  </div>
                </div>
                {/* === /Add-to-cart bar === */}
              </div>
            </div>
          </div>
        )}
        {/* ===== /Hover Sizes Rail ===== */}
      </div>

      {/* Info */}
      <div className="py-2 flex w-full flex-col gap-1">
        <h3 className="text-[12px] tablet:text-[14px] font-medium line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[12px] tablet:text-[14px] mt-2 font-semibold">
          {product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;