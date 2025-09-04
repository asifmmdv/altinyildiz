import React from "react";
import { FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  return (
    <div className="cursor-pointer">
      <div className="relative overflow-hidden">
        {/* Heart icon */}
        <button
          className="absolute top-2 right-2 z-10 bg-[rgb(238,238,237)] rounded-full p-2 cursor-pointer"
        >
          <FaRegHeart className="text-gray-700 w-4 h-4" />
        </button>

        {/* Product image */}
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="object-contain w-full"
        />
      </div>

      {/* Info */}
      <div className="py-2 flex w-full flex-col gap-1">
        <h3 className="text-[12px] font-medium line-clamp-2">{product.name}</h3>
        <p className="text-[12px] mt-2 font-semibold">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;