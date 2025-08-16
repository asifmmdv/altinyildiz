import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.video && (
          <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
            🎥 Video
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-xs">{product.color}</p>
        <p className="text-red-600 font-semibold">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;