import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "./CartItemCard";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems,totalAmount } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen bg-amber-50 flex justify-center p-6">
      <div className="w-full max-w-200">
        <div className="flex items-center gap-4 mb-6 relative">
          <div className=" z-10 " onClick={() => navigate("/")}>
            <IoMdArrowBack size={35} className="text-orange-400" />
          </div>
          <h1 className="text-center font-semibold text-2xl">Your Cart</h1>
        </div>
        {cartItems?.length == 0 ? (
          <p className="text-lg text-gray-500 text-center">
            Your Cart is Empty
          </p>
        ) : (<>
          <div className="space-y-4">
            {cartItems?.map((data, index) => (
              <CartItemCard data={data} key={index} />
            ))}
          </div>
          <div className="mt-6 bg-white p-4 rounded-xl
          shadow flex justify-between items-center border">
            <h1 className="text-lg font-semibold">Total Amount:</h1>
            <span className="text-lg font-bold text-orange-500">₹{totalAmount}</span>
          </div>
          <div className="mt-5 flex justify-end">
            <button onClick={()=> navigate("/check-out")}
             className="bg-orange-500 text-white cursor-pointer
            px-6 py-3 rounded-lg text-lg font-medium hover:bg-orange-700">Proceed to CheckOut</button>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
