import React, { useEffect, useRef, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import {
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaMinus,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { toast } from "react-toastify";
import FoodCard from "./FoodCard";

const PopularFoods = ({ selectedCategory }) => {
  const navigate = useNavigate();
  const sliderRef = useRef();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);

  // 1. Change state to an object to track each item's quantity individually
  const [quantities, setQuantities] = useState({});

  const { itemsInMyCity } = useSelector((state) => state.user);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  const renderStar = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" />
        ),
      );
    }
    return stars;
  };

  // 2. Accept the food ID as an argument to update only that item
  const handleInc = (_id) => {
    setQuantities((prev) => ({
      ...prev,
      [_id]: (prev[_id] || 0) + 1,
    }));
  };

  const handleDec = (_id) => {
    setQuantities((prev) => {
      const currentQty = prev[_id] || 0;
      if (currentQty <= 0) return prev;
      return {
        ...prev,
        [_id]: currentQty - 1,
      };
    });
  };

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
  };
  useEffect(() => {
    if (selectedCategory === "Others" || !selectedCategory) {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity.filter(
        (item) => item.category === selectedCategory,
      );

      setUpdatedItemsList(filteredList);
    }
  }, [itemsInMyCity, selectedCategory]);
  return (
    <section className="h-[100vh] md:h-[90vh] mt-5 md:mb-2 w-full py-14 ">
      {/* Heading & Scroll Buttons */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-orange-600">
            Most Popular Foods In Your City
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-lg">
            Discover trending delicious foods loved by everyone.
          </p>
        </div>
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
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {updatedItemsList?.length === 0 && (
          <p className="text-center text-gray-500">
            No restaurants available in your city.
          </p>
        )}
        {updatedItemsList?.map((food) => (
          <FoodCard key={food._id} food={food} />
        ))}

        <button
          onClick={() => navigate("/menu")}
          className="px-6 py-3 text-orange-600 cursor-pointer underline"
        >
          Explore More
        </button>
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

export default PopularFoods;
