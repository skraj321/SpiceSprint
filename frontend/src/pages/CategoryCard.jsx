// CategoryCard.jsx

import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategoryCard = ({ data, selectedCategory, setSelectedCategory }) => {
  const sliderRef = useRef();

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
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(item.category)}
            className={`min-w-[220px] md:min-w-[260px]
  rounded-3xl overflow-hidden shadow-lg
  transition duration-300 cursor-pointer mb-2
  ${selectedCategory === item.category ? "ring-4 ring-orange-500" : ""}`}
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
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                {item.category}
              </h2>
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

export default CategoryCard;
