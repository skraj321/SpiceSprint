import React from "react";
import { data } from "react-router-dom";
import {
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { removeCartItem, updateQuantity } from "../redux/userSlice";


const CartItemCard = ({ data }) => {
    const dispatch=useDispatch()
    const handleInc=(id,currentQty)=>{
        dispatch(updateQuantity({id,quantity:currentQty+1}))
    }
     const handleDec=(id,currentQty)=>{
        if(currentQty > 1){
             dispatch(updateQuantity({id,quantity:currentQty-1}))
        }
    }
  return (
    <div
      className="flex items-center justify-between bg-white p-4
    rounded-xl shadow border"
    >
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt=""
          className="w-30 h-30 object-cover rounded-lg border"
        />
        <div>
          <h1 className="font-medium text-gray-800 text-2xl mb-2">
            {data.name}
          </h1>
          <p className="font-medium text-sm text-gray-600">
            ₹{data.price} x {data.quantity} =
          </p>
          <p className="font-bold text-gray-900">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={()=>handleDec(data.id,data.quantity)}
          className="px-2 hover:bg-gray-300 transition text-gray-500 cursor-pointer"
        >
          <FaMinus size={12} />
        </button>
        <span className="text-gray-800 font-semibold px-1">
          {data.quantity}
        </span>
        <button onClick={()=>handleInc(data.id,data.quantity)}
          className="px-2  hover:bg-gray-300 transition text-gray-500 cursor-pointer"
        >
          <FaPlus size={12} />
        </button>
        <button onClick={()=>dispatch(removeCartItem(data.id))}
         className="p-2 bg-red-100 text-red-600 rounded-full cursor-pointer">
            <CiTrash size={18}/>
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
