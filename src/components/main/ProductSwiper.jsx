import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { data } from "../../data/data";

const ProductSwiper = () => {
  const navigate = useNavigate();
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
    <div className="relative group"> {/* 👈 group wrapper for hover */}
      <Swiper
        modules={[Navigation]}
        loop={true}
        slidesPerView={2.5}
        spaceBetween={12}
        navigation={{
          prevEl: ".swiper-button-prev", // 👈 link to custom classes
          nextEl: ".swiper-button-next",
        }}
        breakpoints={{
          640: {
            slidesPerView: 3.5,
            spaceBetween: 16,
          },
          780: {
            slidesPerView: 5.8,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 5.8,
            spaceBetween: 30,
          },
        }}
      >
        {/* First fixed slide */}
        <SwiperSlide className="relative">
          <img
            src="/img/productswiper.jpg"
            alt="Featured Product"
            className="min-w-[122px] min-h-[224px] max-h-[361px]"
          />
        </SwiperSlide>

        {/* Dynamic product slides */}
        {productsWithImages.map((product, index) => (
          <SwiperSlide
            key={index}
            className="flex flex-col gap-1 w-[122px] cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="min-w-[122px] min-h-[183px] max-h-[361px] object-cover"
            />
            <div className="text-black p-[10px] flex flex-col gap-1">
              <p className="text-[12px] leading-[16px] tablet-lg:text-[14px]">
                {product.name.slice(0, 20)}
              </p>
              <p className="text-[12px] tablet-lg:text-[14px]">{product.price}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 👇 Custom arrows */}
      <div className="swiper-button-prev hidden! laptop:flex! opacity-0 group-hover:opacity-100 transition duration-300 items-center justify-center w-12! h-10 bg-white rounded-md shadow-md absolute left-9! top-[32%]! -translate-y-1/2 cursor-pointer z-10"></div>
      <div className="swiper-button-next hidden! laptop:flex! opacity-0 group-hover:opacity-100 transition duration-300 items-center justify-center w-12! h-10 bg-white rounded-md shadow-md absolute right-9! top-[32%]! -translate-y-1/2 cursor-pointer z-10"></div>
    </div>
  );
};

export default ProductSwiper;