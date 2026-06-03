import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { setShopData } from "../redux/adminSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

const AddItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading]=useState(false);
  const { shopData } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    category: "",
    price: 0,
    foodType: "",
  });
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddShop = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("image", formData.image);
      form.append("category", formData.category);
      form.append("price", formData.price);
      form.append("foodType", formData.foodType);

      const res = await axios.post(`${serverUrl}/api/add-item`, form, {
        withCredentials: true,
      });
      dispatch(setShopData(res.data.shop));
      console.log(res.data.shop);
      setLoading(false);
      toast.success("Item Saved Successfully",{
        className: "!mt-16 !bg-orange-50 !text-orange-600",
              progressClassName: "!bg-orange-500",
      });
      navigate("/");
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
          <div className="text-3xl font-bold text-gray-800">Add Food</div>
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
              placeholder="Enter Item Name"
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
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Category</option>

              <option value="Snacks">Snacks</option>
              <option value="Main Course">Main Course</option>
              <option value="Desserts">Desserts</option>
              <option value="Pizza">Pizza</option>
              <option value="Burgers">Burgers</option>
              <option value="Sandwiches">Sandwiches</option>
              <option value="North Indian">North Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              min="0"
              name="price"
              onChange={handleChange}
              value={formData.price}
              placeholder="Enter Item Price"
              className="w-full px-4 py-2 
                border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Food Type
            </label>
            <select
            name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select Food Type</option>
                <option value="veg">Veg</option>
                <option value="nonveg">NonVeg</option>
            </select>
          </div>

          <button
            onClick={handleAddShop}
            className="w-full bg-orange-400 rounded-lg text-white
            px-6 py-3 font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
          disabled={loading}>
            {loading? "Loading..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
