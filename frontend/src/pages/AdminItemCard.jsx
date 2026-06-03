import React from "react";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setShopData } from "../redux/adminSlice";

const AdminItemCard = ({ data }) => {
    const navigate=useNavigate();
    
    const dispatch=useDispatch();
    const handleDeleteItem=async(e)=>{
       
        try{
            const res = await axios.delete(`${serverUrl}/api/item-delete/${data._id}`,{
                withCredentials:true
            })
            toast.success("Item Deleted Successfully",{
              className: "!mt-16 !bg-orange-50 !text-orange-600",
              progressClassName: "!bg-orange-500",
            });
            dispatch(setShopData(res.data.shop));
           navigate("/");
        }catch(err){
            console.log(err);
        }
    }
  return (
    <>
    
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden 
      border border-orange-100 hover:shadow-2xl 
      transition-all duration-300 w-full max-w-sm mb-4"
    >
      {/* Image Section */}
      <div className="relative w-full h-50 flex shrink-0">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />

        {/* Edit & Delete Icons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={()=>navigate(`/edit-item/${data._id}`)}
            className="bg-white/90 p-2 rounded-full shadow-md
            hover:bg-orange-500 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <MdEdit size={20} />
          </button>

          <button onClick={handleDeleteItem}
            className="bg-white/90 p-2 rounded-full shadow-md
            hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <FaTrashAlt size={18} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {data.name}
          </h2>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className="bg-orange-100 text-orange-600 text-sm
              px-3 py-1 rounded-full font-medium"
            >
              {data.category}
            </span>

            <span
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                data.foodType === "veg"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {data.foodType}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-2xl font-bold text-orange-500">
            ₹{data.price}
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminItemCard;