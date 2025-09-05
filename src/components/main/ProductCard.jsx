import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishListContext";

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // ❤️ wishlist state
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.id);

  // handle hover movement (only on laptop+)
  const handleMouseMove = (e) => {
    if (!hovered || !product.images || window.innerWidth < 1024) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const percent = x / width;
    const idx = Math.floor(percent * product.images.length);

    if (idx !== imageIndex) {
      setImageIndex(idx);
    }
  };

  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setImageIndex(0);
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="relative overflow-hidden">
        {/* ❤️ Heart icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          className="absolute top-2 right-2 z-10 bg-[rgb(238,238,237)] rounded-full p-2 cursor-pointer"
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

        {/* --- Line Indicators at Bottom of Image --- */}
        {product.images?.length > 1 && (
          <div className="hidden laptop:flex absolute bottom-0 left-0 items-center right-0 bg-white h-4 justify-center gap-1">
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