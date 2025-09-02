// src/pages/ProductPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { data } from "../data/data";
import ProductCard from "../components/main/ProductCard";

function findNodeBySlug(categories, slug) {
  for (const cat of categories) {
    if (cat.slug === slug) return cat;
    if (cat.subcategories) {
      const found = findNodeBySlug(cat.subcategories, slug);
      if (found) return found;
    }
  }
  return null;
}

function collectAllProducts(node, out = []) {
  if (!node) return out;
  if (Array.isArray(node.products)) out.push(...node.products);
  if (Array.isArray(node.subcategories)) {
    for (const sub of node.subcategories) collectAllProducts(sub, out);
  }
  return out;
}

export default function ProductPage() {
  const { slug } = useParams();

  // 1) Find the category/subcategory node that matches the slug
  const node = findNodeBySlug(data.categories, slug);

  // 2) From that node, gather ALL products recursively (including children)
  const products = collectAllProducts(node, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Simple heading + back link */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg md:text-2xl font-semibold capitalize">
          {node?.name || "Ürünler"}
        </h1>
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          Anasayfa
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-sm text-gray-600">
          Bu kategori için ürün bulunamadı.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block">
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}