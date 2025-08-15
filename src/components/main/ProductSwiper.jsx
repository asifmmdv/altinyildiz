import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules"; // Removed Autoplay
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
      modules={[Navigation]} // Autoplay removed
      spaceBetween={30}
      slidesPerView={2.5}
      loop={true}
      breakpoints={{
        1280: {
          navigation: true,
        },
      }}
    >
      {/* First fixed slide */}
      <SwiperSlide className="relative">
        <img
          src="/img/productswiper.jpg"
          alt="Featured Product"
          className="min-w-[122px] h-[224px]"
        />
      </SwiperSlide>

      {/* Dynamic product slides */}
      {productsWithImages.map((product, index) => (
        <SwiperSlide key={index} className="flex flex-col gap-1 w-[122px]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="min-w-[122px] h-[183px] object-cover"
          />
          <div className="text-black p-[10px] flex flex-col gap-1">
            <p className="text-[12px] leading-[16px]">
              {product.name.slice(0, 20)}
            </p>
            <p className="text-[12px]">{product.price}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductSwiper;