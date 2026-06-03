import React from "react";
import { FaMobileAlt } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";

const AdminOrderCard = ({ data }) => {
  const shopOrder = Array.isArray(data?.shopOrders)
  ? data.shopOrders[0]
  : data.shopOrders;
  
  const [availableBoys, setAvailableBoys] = useState([]);
  const dispatch = useDispatch();
  const handleUpdateStatus = async (orderId, shopId, status) =>{
    try{
      const res=await axios.post(`${serverUrl}/api/update-status/${orderId}/${shopId}`,{status},{
        withCredentials:true
      })
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(res.data.availableBoys || []);
      console.log(res.data)
    }catch(err){
      console.error("Error updating order status:", err);
    }
  }
  const shopId =
  shopOrder?.shop?._id ||
  shopOrder?.shop
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="p-1">
        <h2 className="text-lg font-semibold text-gray-800">
          {data?.user?.name}
        </h2>
        <p className="text-sm font-medium text-gray-600">{data?.user?.email}</p>
        <p className="flex items-center gap-1 font-medium text-sm text-gray-600 mt-1">
          <FaMobileAlt />
          <span>{data?.user?.mobile}</span>
        </p>
        {data?.paymentMethod=="online"?
        <p className="text-sm font-medium text-gray-600">payment: {data?.payment?"true":"false"}</p>:
         <p className="text-sm font-medium text-gray-600">Payment Method: {data?.paymentMethod?.toUpperCase()}</p>
        }
      </div>
      <div className="flex items-start flex-col gap-2 text-gray-600 text-sm">
        <p>{data?.delAddress?.text}</p>
        <p className="text-xs text-gray-500">
          Lat:{data?.delAddress?.latitude}, Lon:{data?.delAddress?.longitude}
        </p>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {shopOrder?.shopOrderItems?.map((item, index) => (
          <div
            key={index}
            className="shrink-0 w-40 border
                        rounded-lg p-2 bg-white"
          >
            <img
              src={item.item.image}
              alt=""
              className="w-full h-24 object-cover rounded"
            />
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-sm font-medium text-gray-500">
              ₹{item.price} x {item.quantity}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-300">
        <span className="text-sm font-medium">status: <span className="font-semibold font-serif capitalize text-orange-500">{shopOrder?.status}</span></span>
        <select  onChange={(e) => handleUpdateStatus(data._id, shopId, e.target.value)} className="rounded-md border px-3 py-1
        text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" >
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out for delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {shopOrder?.status == "out for delivery" && availableBoys?.length > 0 ? (
        <div className="mt-3 p-2 border rounded bg-gray-50">
          <h2 className="text-md font-semibold text-gray-700 mb-2">Available Delivery Boys</h2>
          <ul className="text-sm font-medium text-gray-600 space-y-1">
            {availableBoys.map((boy) => (
              <li key={boy.id}>{boy.name} - {boy.mobile} - {boy.email}</li>
            ))}
          </ul>
        </div>
      ):shopOrder?.assignedDelBoy? 
      <div className="space-y-1"><h2 className="
      text-gray-700 font-semibold text-lg">Assigned Delivery Boy:</h2>
      <div className="flex flex-col">
      <p className="font-medium text-md text-orange-600">{shopOrder?.assignedDelBoy?.name},</p>
       <p className="font-medium text-md text-gray-600 flex mt-2"><FaMobileAlt className="mt-1" />- {shopOrder?.assignedDelBoy?.mobile}</p>
       </div>
      </div>:
      <div className="mt-3 p-2 border rounded bg-gray-50">
        <h2 className="text-md font-semibold text-gray-700 mb-2">Waiting for Delivery Boy to Accept</h2>
      </div>
       }

      <div className="text-right font-semibold">
        Total: ₹{shopOrder?.subTotal}
      </div>
    </div>
  );
};

export default AdminOrderCard;
