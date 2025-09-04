import React from 'react';
import { useNavigate } from 'react-router-dom';
import { data } from '../../data/data';
import TopSwiper from './TopSwiper';
import ProductSwiper from './ProductSwiper';

function Main() {
  const navigate = useNavigate();
  const firstGroup = [
    {
      img: data.categories[0].subcategories[0].subcategories
        .find(c => c.slug === 'tisort')
        ?.subcategories.find(s => s.slug === 'polo-yaka-tisort')?.image,
      slug: 'polo-yaka-tisort',
    },
    {
      img: data.categories[0].subcategories[0].subcategories.find(c => c.slug === 'tisort')?.image,
      slug: 'tisort',
    },
    {
      img: data.categories[0].subcategories[0].subcategories.find(c => c.slug === 'gomlek')?.image,
      slug: 'gomlek',
    },
    {
      img: data.categories[0].subcategories[0].subcategories.find(c => c.slug === 'sweatshirt')?.image,
      slug: 'sweatshirt',
    },
    {
      img: data.categories[0].subcategories[0].subcategories
        .find(c => c.slug === 'pantolon')
        ?.subcategories.find(s => s.slug === 'jean')?.image,
      slug: 'jean',
    },
    {
      img: data.categories[0].subcategories[0].subcategories.find(c => c.slug === 'pantolon')?.image,
      slug: 'pantolon',
    },
    {
      img: data.categories[0].subcategories[0].subcategories.find(c => c.slug === 'ceket')?.image,
      slug: 'ceket',
    },
    {
      img: data.categories[0].subcategories[0].subcategories.find(c => c.slug === 'takim-elbise')?.image,
      slug: 'takim-elbise',
    },
  ].filter(item => item.img);

  const lastFour = [
    {
      img: data.categories[0].subcategories.find(c => c.slug === 'ayakkabi')?.image,
      slug: 'ayakkabi',
    },
    {
      img: data.categories[0].subcategories.find(c => c.slug === 'ayakkabi')
        ?.subcategories.find(s => s.slug === 'sneaker-spor-ayakkabi')?.image,
      slug: 'sneaker-spor-ayakkabi',
    },
    {
      img: data.categories[0].subcategories.find(c => c.slug === 'aksesuar')
        ?.subcategories.find(s => s.slug === 'parfum')?.image,
      slug: 'parfum',
    },
    {
      img: data.categories[0].subcategories.find(c => c.slug === 'aksesuar')
        ?.subcategories.find(s => s.slug === 'canta')?.image,
      slug: 'canta',
    },
  ].filter(item => item.img);

  return (
    <>
      <div className="w-full max-tablet-lg:max-w-[640px] max-laptop:max-w-[768px] max-desktop:max-w-[984px] mx-auto max-desktop-lg:max-w-[1240px] max-desktop-xl:max-w-[1360px] desktop-xl:max-w-[1460px]">
        <TopSwiper />
        <section className="p-4">
          <div className="flex justify-between items-center mb-2.5">
            <h2 className="font-medium text-[18px]">FLAŞ ÜRÜNLER</h2>
          </div>

          <ProductSwiper />

          <div className="photos grid grid-cols-1 tablet-lg:grid-cols-2 laptop:mt-[-160px] gap-2 py-5">
            {firstGroup.map((item, idx) => (
              <img
                key={idx}
                src={item.img}
                alt={`photo-${item.slug}`}
                className="w-full object-cover cursor-pointer"
                role="button"
                onClick={() => navigate(`/products/${item.slug}`)}
              />
            ))}

            {/* Last 4 photos in one row (clickable) */}
            <div className="grid grid-cols-2 tablet-lg:grid-cols-4 gap-2 col-span-full">
              {lastFour.map((item, idx) => (
                <img
                  key={`last-${idx}`}
                  src={item.img}
                  alt={`last-photo-${item.slug}`}
                  className="w-full object-cover cursor-pointer"
                  role="button"
                  onClick={() => navigate(`/products/${item.slug}`)}
                />
              ))}
            </div>
          </div>
           <img
            className="mt-10 block tablet-lg:hidden"
            src="/img/downloadapp.jpg"
            alt="dapp"
          />
          <img
            className="mt-5 hidden tablet-lg:block"
            src="/img/downloadappdesktop.jpg"
            alt="dapp"
          />
        </section>
      </div>
    </>
  );
}

export default Main;