import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./TopSwiper.css";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

const TopSwiper = () => {
  return (
    <>
      {/* Mobile (<768px) */}
      <div className="block md:hidden">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
        >
          <SwiperSlide><img src="/img/slider1.jpg" alt="sl1" /></SwiperSlide>
          <SwiperSlide><img src="/img/slider2.jpg" alt="sl2" /></SwiperSlide>
          <SwiperSlide><img src="/img/slider3.jpg" alt="sl3" /></SwiperSlide>
          <SwiperSlide><img src="/img/slider4.jpg" alt="sl4" /></SwiperSlide>
          <SwiperSlide><img src="/img/slider5.jpg" alt="sl5" /></SwiperSlide>
          <SwiperSlide><img src="/img/slider6.jpg" alt="sl6" /></SwiperSlide>
          <SwiperSlide><img src="/img/slider7.jpg" alt="sl7" /></SwiperSlide>
          <SwiperSlide><img src="/img/slider8.jpg" alt="sl8" /></SwiperSlide>
        </Swiper>
      </div>

      {/* Desktop (≥768px) */}
      <div className="hidden md:block group relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
      >
        <SwiperSlide><img src="/img/slider11.jpg" alt="sl11" /></SwiperSlide>
        <SwiperSlide><img src="/img/slider12.jpg" alt="sl12" /></SwiperSlide>
        <SwiperSlide><img src="/img/slider13.jpg" alt="sl13" /></SwiperSlide>
        <SwiperSlide><img src="/img/slider14.jpg" alt="sl14" /></SwiperSlide>
        <SwiperSlide><img src="/img/slider15.jpg" alt="sl15" /></SwiperSlide>
        <SwiperSlide><img src="/img/slider16.jpg" alt="sl16" /></SwiperSlide>
        <SwiperSlide><img src="/img/slider17.jpg" alt="sl17" /></SwiperSlide>
      </Swiper>

      {/* Arrows */}
      <div className="swiper-button-prev hidden! laptop:flex! opacity-0 group-hover:opacity-100 transition duration-300 items-center justify-center w-12! h-10 bg-white rounded-md shadow-md absolute left-9! top-[52%]! -translate-y-1/2 cursor-pointer z-10"></div>
      <div className="swiper-button-next hidden! laptop:flex! opacity-0 group-hover:opacity-100 transition duration-300 items-center justify-center w-12! h-10 bg-white rounded-md shadow-md absolute right-9! top-[52%]! -translate-y-1/2 cursor-pointer z-10"></div>
    </div>
    </>
  );
};

export default TopSwiper;