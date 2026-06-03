import React from "react";
import Navbar from "../pages/Navbar";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import AdminItemCard from "./AdminItemCard";

const AdminDash = () => {
  const { shopData } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      {!shopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div
            className="w-full max-w-md bg-white shadow-lg
        rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-orange-400 w-16 h-16 sm:w-20 sm:h-20 mb-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {" "}
                Join food delivery platform and click on get started button
                below and add your restaurant & food items
              </p>
              <button
                onClick={() => navigate("/add-shop")}
                className="bg-orange-400 text-white px-5 sm:px-6 py-2 rounded-full
font-medium shadow-md hover:bg-amber-600 transition-colors duration-200 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
      {shopData && (
        <div className="w-full flex flex-col items-center gap-5 px-4 sm:px-6">
          <h1
            className="text-2xl sm:text-3xl text-gray-800 flex
          flex-col gap-3 mt-8 text-center items-center font-medium"
          >
            <FaUtensils className="text-orange-500 text-center  w-14 h-14 sm:w-20 sm:h-20 mb-4" />
            Welcome to {shopData.name}
          </h1>
          <div
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100
         hover:shadow-2xl transition-all duration-300 w-full max-w-2xl relative"
          >
            <div
              className="absolute top-4 right-4 bg-blue-700
            text-white p-2 rounded-full shadow-md 
            hover:bg-orange-600 transition-colors cursor-pointer"
              onClick={() => navigate("/add-shop")}
            >
              <MdEdit size={30} />
            </div>
            <img
              src={shopData.image}
              alt={shopData.name}
              className="w-full h-48 sm:h-64"
            />
            <div className="p-4 sm:p-6">
              <h1
                className="text-xl sm:text-2xl font-medium
            text-gray-800 mb-2"
              >
                {shopData.name}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-1">
                {shopData.city},{shopData.state}
              </p>
              <p className="text-xl sm:text-2xl text-gray-600 mb-1">
                {shopData.address}
              </p>
            </div>
          </div>

          {shopData?.items?.length == 0 && (
            <div className="flex justify-center items-center p-4 sm:p-6">
              <div
                className="w-full max-w-md bg-white shadow-lg
        rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="text-orange-400 w-16 h-16 sm:w-20 sm:h-20 mb-5" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Add Your Food Item
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    {" "}
                    Share your delicious items with our customers by adding them
                    to the menu.
                  </p>
                  <button
                    onClick={() => navigate("/add-item")}
                    className="bg-orange-400 text-white px-5 sm:px-6 py-2 rounded-full
font-medium shadow-md hover:bg-amber-600 transition-colors duration-200 cursor-pointer"
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          )}
          {shopData?.items?.length > 0 && (
             <div className="w-full max-w-5xl">
    
    <h2
      className="text-3xl font-bold text-gray-800
      mb-6 text-center"
    >
      Your Foods
    </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2
             gap-8 w-full max-w-5xl"
            >
              {shopData.items.map((item, index) => {
                return <AdminItemCard data={item} key={index} />;
              })}
            </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDash;
