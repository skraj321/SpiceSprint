import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/hero.png";
import About from "../components/About";
import Contact from "../components/Contact";
import { useSelector } from "react-redux";
import Navbar from "../pages/Navbar";
import PopularFoods from "../components/PopularFoods";
import Hero from "../components/Hero";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import ShopsInCity from "./ShopsInCity";
import axios from "axios";
import { serverUrl } from "../App";
import FoodCard from "../components/FoodCard";

const UserDash = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const {currentCity} = useSelector((state)=>state.user);
  const {shopsInMyCity} =useSelector((state)=>state.user)
  const {searchItems} =useSelector((state)=>state.user)
  const [selectedCategory, setSelectedCategory] = useState("Others");
  
  return (
    <section className="min-h-screen w-[85%] overflow-x-hidde">
      <Navbar />
      {searchItems && searchItems.length>0 &&(
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5
        bg-white shadow-md rounded-2xl mt-4 mb-2">
          <h1 className="text-gray-800 text-2xl sm:text-3xl font-semibold border-b
          border-gray-200 pb-2">Search Results</h1>
          <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
            {searchItems.map((item)=>(
              <FoodCard food={item} key={item._id} />
            ))}
          </div>
        </div>
      )}
       <Hero/>

      {/*  NORMAL SECTIONS (no background) */}
      <div className="w-full md:px-12 py-10">
        {/* Categories */}
        <div className="w-full max-w-6xl flrx flex-col gap-4 item-start p-3 mt-5">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-600">
            Explore Delicious Categories
          </h1>
           <p className="text-gray-700 mt-2 text-sm md:text-lg">
         Explore popular food categories and enjoy quick delivery from the best restaurants in your city.</p>
        <CategoryCard
  data={categories}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
/>

        </div>
        {/* Shop in Your City */}
        <div className="w-full max-w-6xl flex flex-col gap-4 item-start p-3 mt-5">
        <h1 className="text-3xl md:text-4xl font-bold text-orange-600">
          Best Shop in {currentCity}
          </h1>
          <ShopsInCity  />
        </div>
<PopularFoods selectedCategory={selectedCategory} />
        <About />
        <Contact />
      </div>
    </section>
  );
};

export default UserDash;
