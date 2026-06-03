import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { setShopData } from "../redux/adminSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

const AddShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shopData } = useSelector((state) => state.admin);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user,
  );
  const [formData, setFormData] = useState({
    name: shopData?.name || "",
    address: shopData?.address || currentAddress,
    city: shopData?.city || currentCity,
    state: shopData?.state || currentState,
    image: null,
  });
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddShop = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("city", formData.city);
      form.append("state", formData.state);
      form.append("address", formData.address);
      form.append("image", formData.image);

      const res = await axios.post(`${serverUrl}/api/create-edit`, form, {
        withCredentials: true,
      });
      dispatch(setShopData(res.data));
      console.log(res.data);
      toast.success("Shop Saved Successfully",{
        className: "!mt-16 !bg-orange-50 !text-orange-600",
              progressClassName: "!bg-orange-500",
      })
      navigate("/")
    } catch (err) {
      console.log("error:", err);
    }
  };
  return (
    <div
      className="flex justify-center flex-col items-center p-6 bg-gray-100
    min-h-screen relative "
    >
      <div
        className="absolute top-5 left-5 z-10 mb-3"
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack size={35} className="text-orange-400" />
      </div>
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="text-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-orange-500 w-16 h-16" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {shopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>
        <form className="space-y-5">
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              placeholder="Enter Shop Name"
              className="w-full px-4 py-2 
                border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              onChange={(e) => {
                setFormData({ ...formData, image: e.target.files[0] });
              }}
              className="w-full px-4 py-2 cursor-pointer
                border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                onChange={handleChange}
                value={formData.city}
                placeholder="Enter Shop City"
                className="w-full px-4 py-2 
                border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                onChange={handleChange}
                value={formData.state}
                placeholder="Enter Shop State"
                className="w-full px-4 py-2 
                border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              onChange={handleChange}
              value={formData.address}
              placeholder="Enter Shop Address"
              className="w-full px-4 py-2 
                border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={handleAddShop}
            className="w-full bg-orange-400 rounded-lg text-white
            px-6 py-3 font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShop;
