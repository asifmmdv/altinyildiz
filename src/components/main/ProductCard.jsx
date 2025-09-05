import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // handle hover movement
  const handleMouseMove = (e) => {
    if (!hovered || !product.images) return;

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
        {/* Heart icon */}
        <button className="absolute top-2 right-2 z-10 bg-[rgb(238,238,237)] rounded-full p-2 cursor-pointer">
          <FaRegHeart className="text-gray-700 w-4 h-4" />
        </button>

        {/* Product image */}
        <img
          src={product.images?.[imageIndex] || product.images?.[0]}
          alt={product.name}
          className="object-contain w-full transition duration-300"
        />
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