import React from "react";
import { useNavigate } from "react-router-dom";
import { data } from "../../data/data";
import TopSwiper from "./TopSwiper";
import ProductSwiper from "./ProductSwiper";

function Main() {
  const navigate = useNavigate();

  // Shorthands into your catalog structure
  const ROOT = data.categories?.[0];
  const G1 = ROOT?.subcategories?.[0]; // the branch you were using repeatedly

  // Helpers to fetch images from common paths you used
  const imgG1 = (slug) => G1?.subcategories?.find((c) => c.slug === slug)?.image;
  const imgG1Child = (parent, child) =>
    G1?.subcategories
      ?.find((c) => c.slug === parent)
      ?.subcategories?.find((s) => s.slug === child)?.image;

  const imgTop = (slug) => ROOT?.subcategories?.find((c) => c.slug === slug)?.image;
  const imgTopChild = (parent, child) =>
    ROOT?.subcategories
      ?.find((c) => c.slug === parent)
      ?.subcategories?.find((s) => s.slug === child)?.image;

  const firstGroup = [
    { img: imgG1Child("tisort", "polo-yaka-tisort"), slug: "polo-yaka-tisort" },
    { img: imgG1("tisort"), slug: "tisort" },
    { img: imgG1("gomlek"), slug: "gomlek" },
    { img: imgG1("sweatshirt"), slug: "sweatshirt" },
    { img: imgG1Child("pantolon", "jean"), slug: "jean" },
    { img: imgG1("pantolon"), slug: "pantolon" },
    { img: imgG1("ceket"), slug: "ceket" },
    { img: imgG1("takim-elbise"), slug: "takim-elbise" },
  ].filter((x) => x.img);

  const lastFour = [
    { img: imgTop("ayakkabi"), slug: "ayakkabi" },
    { img: imgTopChild("ayakkabi", "sneaker-spor-ayakkabi"), slug: "sneaker-spor-ayakkabi" },
    { img: imgTopChild("aksesuar", "parfum"), slug: "parfum" },
    { img: imgTopChild("aksesuar", "canta"), slug: "canta" },
  ].filter((x) => x.img);

  return (
    <>
      <div className="w-full max-tablet-lg:max-w-[640px] max-laptop:max-w-[768px] max-desktop:max-w-[984px] mx-auto max-desktop-lg:max-w-[1240px] max-desktop-xl:max-w-[1360px] desktop-xl:max-w-[1460px]">
        <TopSwiper />
        <section className="p-4">
          <div className="flex justify-between items-center mb-2.5">
            <h2 className="font-medium text-[18px] ml-2">FLAŞ ÜRÜNLER</h2>
          </div>

          <ProductSwiper />

          <div className="photos grid grid-cols-1 tablet-lg:grid-cols-2 laptop:mt-[-160px] gap-2 py-5">
            {firstGroup.map(({ img, slug }, idx) => (
              <img
                key={idx}
                src={img}
                alt={`photo-${slug}`}
                className="w-full object-cover cursor-pointer"
                role="button"
                onClick={() => navigate(`/products/${slug}`)}
              />
            ))}

            {/* Last 4 photos in one row (clickable) */}
            <div className="grid grid-cols-2 tablet-lg:grid-cols-4 gap-2 col-span-full">
              {lastFour.map(({ img, slug }, idx) => (
                <img
                  key={`last-${idx}`}
                  src={img}
                  alt={`last-photo-${slug}`}
                  className="w-full object-cover cursor-pointer"
                  role="button"
                  onClick={() => navigate(`/products/${slug}`)}
                />
              ))}
            </div>
          </div>

          <img className="mt-10 block tablet-lg:hidden" src="/img/downloadapp.jpg" alt="dapp" />
          <img className="mt-5 hidden tablet-lg:block" src="/img/downloadappdesktop.jpg" alt="dapp" />
        </section>
      </div>
    </>
  );
}

export default Main;