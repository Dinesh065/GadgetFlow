import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./FeaturedGadgets.css"; // Import CSS

// Dummy Data (Replace with API data)
const gadgets = [
  { id: 1, name: "MacBook Pro", price: "$1200", image: "https://via.placeholder.com/200" },
  { id: 2, name: "iPhone 14", price: "$999", image: "https://via.placeholder.com/200" },
  { id: 3, name: "PlayStation 5", price: "$499", image: "https://via.placeholder.com/200" },
  { id: 4, name: "Canon DSLR", price: "$750", image: "https://via.placeholder.com/200" },
];

const FeaturedGadgets = () => {
  return (
    <div className="carousel-container">
      <h2>🔥 Featured Gadgets</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
        }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
      >
        {gadgets.map((item) => (
          <SwiperSlide key={item.id} className="gadget-card">
            <img src={item.image} alt={item.name} className="gadget-img" />
            <h3>{item.name}</h3>
            <p className="gadget-price">{item.price}</p>
            <div className="btn-group">
              <button className="button-29">Buy Now</button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedGadgets;
