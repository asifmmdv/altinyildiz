// src/pages/ProductPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { data } from "../data/data";
import ProductCard from "../components/main/ProductCard";

function ProductPage() {
  const { slug } = useParams();
  const products = [];

  const findProductsBySlug = (categories) => {
    for (const category of categories) {
      if (category.slug === slug && category.products) {
        products.push(...category.products);
      }
      if (category.subcategories) {
        findProductsBySlug(category.subcategories);
      }
    }
  };

  findProductsBySlug(data.categories);

  return (
    <div className="p-4 grid gap-4 grid-cols-2 md:grid-cols-4">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default ProductPage;