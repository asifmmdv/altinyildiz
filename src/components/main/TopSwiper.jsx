import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./TopSwiper.css"

import { Navigation, Pagination, Autoplay } from "swiper/modules";

const TopSwiper = () => {
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
      <SwiperSlide><img src="/img/slider1.jpg" alt="sl1" /></SwiperSlide>
      <SwiperSlide><img src="/img/slider2.jpg" alt="sl2" /></SwiperSlide>
      <SwiperSlide><img src="/img/slider3.jpg" alt="sl3" /></SwiperSlide>
      <SwiperSlide><img src="/img/slider4.jpg" alt="sl4" /></SwiperSlide>
      <SwiperSlide><img src="/img/slider5.jpg" alt="sl5" /></SwiperSlide>
      <SwiperSlide><img src="/img/slider6.jpg" alt="sl6" /></SwiperSlide>
      <SwiperSlide><img src="/img/slider7.jpg" alt="sl7" /></SwiperSlide>
      <SwiperSlide><img src="/img/slider8.jpg" alt="sl8" /></SwiperSlide>
    </Swiper>
  );
};

export default TopSwiper;
