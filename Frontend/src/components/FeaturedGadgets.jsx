import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Dummy Data (Replace with API data)
const gadgets = [
  { id: 1, name: "MacBook Pro", price: "$1200", image: "https://via.placeholder.com/200" },
  { id: 2, name: "iPhone 14", price: "$999", image: "https://via.placeholder.com/200" },
  { id: 3, name: "PlayStation 5", price: "$499", image: "https://via.placeholder.com/200" },
  { id: 4, name: "Canon DSLR", price: "$750", image: "https://via.placeholder.com/200" },
];

const FeaturedGadgets = () => {
  return (
    <div className="text-center py-12 bg-gray-100 max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">🔥 Featured Gadgets</h2>

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
        className="px-4"
      >
        {gadgets.map((item) => (
          <SwiperSlide key={item.id} className="p-4">
            <div className="bg-white rounded-xl shadow-lg p-5 transition-transform duration-300 hover:scale-105">
              <img src={item.image} alt={item.name} className="w-40 mx-auto rounded-lg" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.name}</h3>
              <p className="text-xl text-blue-600 font-bold my-2">{item.price}</p>
              <button className="w-full py-3 mt-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 active:scale-95">
                Buy Now
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedGadgets;
