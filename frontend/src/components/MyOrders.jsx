import React from "react";
import { useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { data, useNavigate } from "react-router-dom";
import UserOrderCArd from "../pages/UserOrderCArd";
import AdminOrderCard from "../pages/AdminOrderCard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMyOrders } from "../redux/userSlice";
import { addNewOrder } from "../redux/userSlice";
import { updateRtOrderStatus } from "../redux/userSlice";
const MyOrders = () => {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;
    const handleNewOrder = (order) => {

      const belongsToAdmin = order?.shopOrders?.some(
        (shopOrder) => shopOrder?.admin?._id === userData?.user?._id,
      );

      console.log("belongsToAdmin:", belongsToAdmin);

      if (belongsToAdmin) {
        dispatch(addNewOrder(order));
      }
    };
    socket?.on("newOrder", handleNewOrder);
    socket?.on("updateStatus", ({ orderId, shopId, status, userId }) => {
      if(userId === userData?.user?._id){
        dispatch(updateRtOrderStatus({ orderId, shopId, status }));
      }
    })
    return () => {
      socket?.off("newOrder", handleNewOrder);
      socket?.off("updateStatus");
    };
  }, [socket, userData]);

  return (
    <div
      className="w-full min-h-screen bg-amber-50 flex justify-center
    px-4"
    >
      <div className="w-full max-w-200 p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className=" z-10 " onClick={() => navigate("/")}>
            <IoMdArrowBack size={35} className="text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-start">My Orders</h1>
        </div>
        <div className="space-y-6">
          {myOrders?.map((order,index) =>
            userData?.user?.role == "user" ? (
              <UserOrderCArd data={order} key={index} />
            ) : userData?.user?.role == "admin" ? (
              <AdminOrderCard data={order} key={index} />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
