import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { data } from "../../data/data"; // adjust path if needed

const ProductSwiper = () => {
  const productsWithImages = [];

  const traverseCategories = (categories) => {
    categories.forEach((category) => {
      if (category.products) {
        category.products.forEach((product) => {
          if (product.images && product.images.length > 0) {
            productsWithImages.push(product);
          }
        });
      }
      if (category.subcategories) {
        traverseCategories(category.subcategories);
      }
    });
  };

  traverseCategories(data.categories);

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      loop={true}
      breakpoints={{
        1280: {
          navigation: true,
        },
      }}
    >
      {productsWithImages.map((product, index) => (
        <SwiperSlide key={index} className="relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm">{product.price}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductSwiper;
