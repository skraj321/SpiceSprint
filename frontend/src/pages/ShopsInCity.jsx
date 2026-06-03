// CategoryCard.jsx

import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ShopsInCity = () => {
  const sliderRef = useRef();
  const navigate = useNavigate();
  const { shopsInMyCity, currentCity } = useSelector((state) => state.user);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-2">
      {/* Top Buttons */}
      <div className="flex items-center justify-end mb-6">
        <div className="hidden md:flex gap-4">
          <button
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronLeft size={18} />
          </button>

          <button
            onClick={scrollRight}
            className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
      >
        {shopsInMyCity?.length === 0 && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-orange-500">
              Service Coming Soon 🚀
            </h2>

            <p className="text-gray-600 mt-2">
              We are not available in {currentCity} yet.
            </p>
          </div>
        )}
        {shopsInMyCity?.map((item, index) => (
          <div
            onClick={() => navigate(`/shop/${item._id}`)}
            key={index}
            className="min-w-[220px] md:min-w-[260px] bg-white rounded-3xl overflow-hidden shadow-lg hover:scale-90 transition duration-300 cursor-pointer mb-2"
          >
            {/* Image */}
            <div className="h-52 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-110 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-4 shadow backdrop:backdrop-blur bg-gray-100 bg-opacity-95 rounded-t-xl">
              <h2 className="text-2xl font-semibold text-orange-600 mb-2">
                {item.name}
              </h2>
              <p className="font-medium">{item.address}</p>
              <p>{item.city} </p>
              <p>{item.state} </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Buttons */}
      <div className="flex md:hidden justify-center gap-4 mt-8">
        <button
          onClick={scrollLeft}
          className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"
        >
          <FaChevronLeft size={18} />
        </button>

        <button
          onClick={scrollRight}
          className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"
        >
          <FaChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default ShopsInCity;
