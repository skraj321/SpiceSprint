import React from 'react'
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const PlacedOrder = () => {
    const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-amber-50 flex flex-col justify-center
    items-center px-4 text-center relative overflow-hidden '>
      <FaCheckCircle className='text-green-500 text-6xl mb-4' />
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>Order Placed!</h1>
      <p className='text-gray-600 max-w-md mb-4'>Thank you for your purchase. Your order is being processed. You can track your order status in the my orders section.</p>
      <button onClick={() => navigate("/my-orders")}
       className='bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer transition'>
        Back to my Orders
      </button>
    </div>
  )
}

export default PlacedOrder
