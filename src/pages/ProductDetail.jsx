// src/pages/ProductDetail.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { data } from "../data/data";

// Simple recursive search function
function findProductById(categories, id, trail = []) {
  for (const category of categories) {
    const nextTrail = [...trail, { name: category.name, slug: category.slug }];

    if (category.products) {
      const match = category.products.find((p) => p.id === id);
      if (match) return { product: match, path: nextTrail };
    }

    if (category.subcategories) {
      const found = findProductById(category.subcategories, id, nextTrail);
      if (found) return found;
    }
  }
  return null;
}

export default function ProductDetail() {
  const { id } = useParams();

  // Directly call the function, no memoization
  const found = findProductById(data.categories, id);

  if (!found) {
    return (
      <div className="px-4 py-8 max-w-6xl mx-auto">
        <p className="text-sm text-gray-600">Ürün bulunamadı.</p>
        <Link to="/products" className="text-blue-600 underline mt-2 inline-block">
          Ürünlere geri dön
        </Link>
      </div>
    );
  }

  const { product, path } = found;
  const [activeIndex, setActiveIndex] = useState(0);
  const images = product.images || [];
  const hasVideo = Array.isArray(product.video) && product.video.length > 0;

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      {/* breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 flex flex-wrap gap-1">
        <Link to="/" className="hover:underline">Anasayfa</Link>
        {path.map((segment) => (
          <React.Fragment key={segment.slug}>
            <span>/</span>
            <Link to={`/products/${segment.slug}`} className="hover:underline">
              {segment.name}
            </Link>
          </React.Fragment>
        ))}
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* gallery */}
        <div>
          <div className="relative w-full overflow-hidden rounded-lg border">
            {images[activeIndex] ? (
              <img
                src={images[activeIndex]}
                alt={`${product.name} ${activeIndex + 1}`}
                className="w-full h-[420px] md:h-[520px] object-cover"
              />
            ) : (
              <div className="w-full h-[420px] md:h-[520px] grid place-items-center text-sm text-gray-500">
                Görsel yok
              </div>
            )}
            {hasVideo && (
              <span className="absolute top-3 right-3 bg-black text-white text-xs px-2 py-1 rounded">
                🎥 Video
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-2">
              {images.map((src, idx) => (
                <button
                  key={src + idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`border rounded overflow-hidden aspect-square ${
                    activeIndex === idx ? "ring-2 ring-black" : ""
                  }`}
                >
                  <img src={src} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {hasVideo && (
            <div className="mt-4">
              <video src={product.video[0]} controls className="w-full rounded-lg border" />
            </div>
          )}
        </div>

        {/* info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-lg md:text-2xl font-semibold">{product.name}</h1>
          <div className="text-gray-600 text-sm">Renk: {product.color}</div>
          <div className="text-rose-600 text-xl font-bold">{product.price}</div>

          {product.sizes?.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Beden</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} className="px-3 py-2 border rounded hover:bg-gray-50 text-sm">
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.details?.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Ürün Özellikleri</div>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {product.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-black text-white rounded-lg px-4 py-3 text-sm font-medium">
              Sepete Ekle
            </button>
            <button className="flex-1 border rounded-lg px-4 py-3 text-sm font-medium">
              Favorilere Ekle
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2">Ürün Kodu: {product.id}</div>
        </div>
      </div>
    </div>
  );
}