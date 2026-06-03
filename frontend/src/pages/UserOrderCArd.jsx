import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";

const UserOrderCArd = ({ data }) => {
  const navigate = useNavigate();
  const [selectedRating,setSelectedRating] = useState({}) 
  const order = data?.order || data;
  const handleRating = async(itemId, rating) => {
    try{
      const result=await axios.post(`${serverUrl}/api/rating`,{
        itemId,
        rating
       },{
        withCredentials: true
      })
      setSelectedRating((prev)=>({
        ...prev,
        [itemId]:rating
      }))
    }catch(err){
      console.error("Error submitting rating:", err);
    }
  }
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="font-semibold">
            order #{order?._id?.slice(-6)}
          </p>
          <p className="text-sm text-gray-500 font-medium">
            Date: {new Date(order?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          {order?.paymentMethod == "cod" ? (
            <p className="text-sm font-semibold text-gray-500">
              {order?.paymentMethod?.toUpperCase() }
            </p>
          ) : (
            <p className="text-sm font-semibold text-gray-500">
              Payment: {(order?.payment ? "true" : "false")}
            </p>
          )}
          <p className="text-sm font-medium text-gray-500">
            {order?.shopOrders?.[0]?.status}
          </p>
        </div>
      </div>
      <div></div>
      {order?.shopOrders?.map((shopOrder, index) => (
        <div
          className="border rounded-lg bg-amber-50 p-3 space-y-3"
          key={index}
        >
          <p>{shopOrder?.shop?.name}</p>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder?.shopOrderItems?.map((item, index) => (
              <div
                key={index}
                className="shrink-0 w-40 border
                        rounded-lg p-2 bg-white"
              >
                <img
                  src={item?.item?.image}
                  alt=""
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-lg font-semibold">{item?.name}</p>
                <p className="text-sm font-medium text-gray-500">
                  ₹{item?.price} x {item?.quantity}
                </p>
                {shopOrder?.status === "delivered" && <div className="mt-2 space-x-1 flex">
                  {[1,2,3,4,5].map((star)=>(
                    <button className={`${selectedRating[item?.item?._id]>=star ? "text-yellow-500" : "text-gray-400"} text-2xl cursor-pointer`}
                    onClick={()=>handleRating(item?.item?._id, star)}>
                      ★
                    </button>
                  ))}
                  </div>}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold">Subtotal: ₹{shopOrder?.subTotal}</p>
            <span className="text-sm font-medium text-blue-600">
              {shopOrder?.status}
            </span>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold">Total: ₹{order?.totalAmount}</p>
        <button
          onClick={() => navigate(`/track-order/${order?._id}`)}
          className="bg-orange-400  hover:bg-orange-600 font-medium text-white py-2 px-4 rounded-lg text-sm"
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCArd;
