import React, { useState } from 'react';
import { data } from '../../data/data';
import TopSwiper from './TopSwiper';
import ProductSwiper from './ProductSwiper';

function Main() {
  return (
    <>
      <TopSwiper/>
      <section className='p-5'> 
        <div className='flex justify-between items-center mb-2.5'>
          <h2 className='font-medium text-[18px]'>FLAŞ ÜRÜNLER</h2>
          <h4 className='text-[12px]'>Tümünü gör</h4>
        </div>
        <ProductSwiper/>
        <div className="photos grid grid-cols-1 gap-2 py-5">
          {[
            data.categories[0].subcategories[0].subcategories.find(c => c.slug === "tisort")?.subcategories.find(s => s.slug === "polo-yaka-tisort")?.image,
            data.categories[0].subcategories[0].subcategories.find(c => c.slug === "tisort")?.image,
            data.categories[0].subcategories[0].subcategories.find(c => c.slug === "gomlek")?.image,
            data.categories[0].subcategories[0].subcategories.find(c => c.slug === "sweatshirt")?.image,
            data.categories[0].subcategories[0].subcategories.find(c => c.slug === "pantolon")?.subcategories.find(s => s.slug === "jean")?.image,
            data.categories[0].subcategories[0].subcategories.find(c => c.slug === "pantolon")?.image,
            data.categories[0].subcategories[0].subcategories.find(c => c.slug === "ceket")?.image,
            data.categories[0].subcategories[0].subcategories.find(c => c.slug === "takim-elbise")?.image,
            data.categories[0].subcategories.find(c => c.slug === "ayakkabi")?.image,
            data.categories[0].subcategories.find(c => c.slug === "ayakkabi")?.subcategories.find(s => s.slug === "sneaker-spor-ayakkabi")?.image,
            data.categories[0].subcategories.find(c => c.slug === "aksesuar")?.subcategories.find(s => s.slug === "parfum")?.image,
            data.categories[0].subcategories.find(c => c.slug === "aksesuar")?.subcategories.find(s => s.slug.toLowerCase() === "çanta")?.image
          ]
            .filter(Boolean)
            .map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`photo-${idx}`}
                className="w-full  object-cover"
              />
            ))}
        </div>
        <img className='mt-10' src="/img/downloadapp.jpg" alt="dapp" />
      </section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
    </div>
    </>
  );
}

export default Main;

