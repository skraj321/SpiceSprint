import React, { useState } from "react";
import {
  FaRegStar,
  FaStar,
  FaMinus,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { toast } from "react-toastify";

const FoodCard = ({ food }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(0);

  const renderStar = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" />
        ),
      );
    }

    return stars;
  };

  const addItemToCart = () => {
    if (quantity <= 0) {
      toast.error("Please select quantity first", {
        className: "!mt-16",
      });
      return;
    }

    dispatch(
      addToCart({
        id: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        shop: food.shop,
        quantity,
        foodType: food.foodType,
      }),
    );

    toast.success(`${food.name} added to cart 🛒`, {
      className: "!mt-16 !bg-orange-50 !text-orange-600",
      progressClassName: "!bg-orange-500",
    });
  };

  return (
    <div className="shrink-0 w-[280px] md:w-[320px] bg-white rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">
      <div className="h-52 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {food.name}
        </h2>

        <div className="flex items-center gap-2 mt-3 text-yellow-500">
          {renderStar(food.rating?.average || 0)}
          <span>{food.rating?.count || 0}</span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-3">
          <span className="text-orange-600 font-bold text-lg">
            ₹{food.price}
          </span>

          <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
            <button
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 0))}
              className="px-2 py-1 hover:bg-gray-100"
            >
              <FaMinus size={12} />
            </button>

            <span className="px-2 font-semibold">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="px-2 py-1 hover:bg-gray-100"
            >
              <FaPlus size={12} />
            </button>

            <button
              onClick={addItemToCart}
              className={`${
                cartItems.some((i) => i.id === food._id)
                  ? "bg-gray-800"
                  : "bg-red-500"
              } px-3 py-2 text-white`}
            >
              <FaShoppingCart size={16} />
            </button>
          </div>
        </div>

        <button
          onClick={addItemToCart}
          className="mt-5 w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-black transition"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;