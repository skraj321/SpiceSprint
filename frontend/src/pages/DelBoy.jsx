import React, { useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DelBoyTracking from "../components/DelBoyTracking";

const DelBoy = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const user = userData?.user;
  const [avlAssignment, setAvlAssignment] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [delBoyLocation, setDelBoyLocation] = useState(null);
  const [totalDeliveries, setTotalDeliveries] = useState([]);
  const [loading,setLoding]=useState(false)

  useEffect(() => {
    if (!socket || user.role !== "deliveryBoy") return;
    let watchId;
    if (navigator.geolocation) {
      ((watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setDelBoyLocation({
          lat: latitude,
          long: longitude,
        });
        socket.emit("updateLocation", {
          latitude,
          longitude,
          userId: user._id,
        });
      })),
        (error) => {
          console.error("Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
        });
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [user, socket]);

  const ratePerDelivery = 50;
  const totalEarning = totalDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0,
  );

  const getAssignment = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/get-assignment`, {
        withCredentials: true,
      });
      setAvlAssignment(result.data.assignment);
    } catch (err) {
      console.error("Error fetching assignment:", err);
    }
  };
  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/get-current-order`, {
        withCredentials: true,
      });
      setCurrentOrder(result.data);
    } catch (err) {
      console.error("Error fetching current order:", err.response.data);
    }
  };
  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/accept-order/${assignmentId}`,
        {
          withCredentials: true,
        },
      );
      toast.success("Order Accepted Successfully", {
        className: "!mt-16 !bg-orange-50 !text-orange-600",
        progressClassName: "!bg-orange-500",
      });
      await getCurrentOrder();
    } catch (err) {
      console.error("Error fetching assignment:", err.response.data);
    }
  };
  const sendOtp = async () => {
    setLoding(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/send-del-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder?.shopOrder._id,
        },
        {
          withCredentials: true,
        },
      );
      setShowOtpBox(true);
      setLoding(false);
      toast.success("Otp sent Successfully", {
        className: "!mt-16 !bg-orange-50 !text-orange-600",
        progressClassName: "!bg-orange-500",
      });
    } catch (err) {
      console.error("Error fetching assignment:", err.response.data);
    }
  };
  const verifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/verify-del-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder?.shopOrder._id,
          otp,
        },
        {
          withCredentials: true,
        },
      );
      toast.success("Otp verified Successfully", {
        className: "!mt-16 !bg-orange-50 !text-orange-600",
        progressClassName: "!bg-orange-500",
      });
      navigate("/");
    } catch (err) {
      console.error("Error fetching assignment:", err.response.data);
    }
  };
  const handleTotalDeliveries = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/get-total-deliveries`, {
        withCredentials: true,
      });
      setTotalDeliveries(result.data);
      console.log(result.data);
    } catch (err) {
      console.error("Error fetching total deliveries:", err.response.data);
    }
  };

  useEffect(() => {
    socket?.on("newAssignment", (data) => {
      if (data.sentTo == user._id) {
        setAvlAssignment((prev) => [...prev, data]);
        toast.info("New Delivery Assignment Received", {
          className: "!mt-16 !bg-blue-50 !text-blue-600",
          progressClassName: "!bg-blue-500",
        });
        console.log("New Assignment:", data);
      }
    });
    return () => {
      socket?.off("newAssignment");
    };
  }, [user, socket]);
  useEffect(() => {
    getAssignment();
    getCurrentOrder();
    handleTotalDeliveries();
  }, [user]);
  return (
    <div
      className="min-h-screen w-screen flex flex-col
    gap-5 items-center bg-amber-50 overflow-y-auto"
    >
      <Navbar />
      <div className="w-full max-w-200 flex flex-col gap-4 items-center text-center">
        <div
          className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start
         items-center w-[90%] border border-gray-200 gap-2"
        >
          <h1 className="text-xl font-bold text-orange-500">
            Welcome, {user.name}
          </h1>
          <p className="text-orange-500">
            <span className="font-semibold">Latitude:</span>{" "}
            {delBoyLocation?.lat},{" "}
            <span className="font-semibold">Longitude:</span>{" "}
            {delBoyLocation?.long}
          </p>
        </div>
        <div className="w-[90%] bg-white rounded-2xl p-5 shadow-md border border-amber-100">
          <h1 className="text-lg font-bold mb-3 text-orange-500">
            Today Deliveries
          </h1>
          <div className="space-y-2">
            {totalDeliveries?.length > 0 ? (
              totalDeliveries.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-orange-50 rounded-lg"
                >
                  <span className="font-medium">
                    {item.hour}:00 - {item.hour + 1}:00
                  </span>

                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    {item.count} Orders
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No deliveries today</p>
            )}
          </div>
          <div
            className="max-w-sm mx-auto mt-5 bg-white rounded-2xl
                  shadow-lg text-center"
          >
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Today's Earning
            </h1>
            <span className="text-2xl font-bold text-green-600">
              ₹{totalEarning}
            </span>
          </div>
        </div>
        {!currentOrder && (
          <div
            className="bg-white rounded-2xl p-5 shadow-md w-[90%] 
        border border-amber-100"
          >
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders
            </h1>

            <div className="space-y-4">
              {avlAssignment?.length > 0 ? (
                avlAssignment.map((a, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4
                flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold">{a.shopName}</p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {a.delAddress.text}
                      </p>
                      <p>
                        {a.items.length} items | {a.subTotal}
                      </p>
                    </div>
                    <button
                      onClick={() => acceptOrder(a.assignmentId)}
                      className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm 
                  hover:bg-orange-600 cursor-pointer"
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No Avaliable Orders</p>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div
            className="bg-white rounded-2xl p-5 shadow-mdw-[90%]
        border border-orange-100"
          >
            <h2 className="text-lg font-bold mb-3">🎁Current Order</h2>
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-md">
                {currentOrder?.shop?.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder?.delAddress?.text}
              </p>
              <p className="text-sm text-gray-500 gap-1">
                {currentOrder?.shopOrder.shopOrderItems?.length}
                <span className="ml-1">
                  items | {currentOrder?.shopOrder?.subTotal}
                </span>
              </p>
            </div>
            <DelBoyTracking
              data={{
                delBoyLocation: delBoyLocation || {
                  lat: user.location?.coordinates[1],
                  long: user.location?.coordinates[0],
                },
                customerLocation: {
                  lat: currentOrder?.delAddress?.latitude,
                  long: currentOrder?.delAddress?.longitude,
                },
              }}
            />
            {!showOtpBox ? (
              <button
                onClick={sendOtp}
                className="w-full mt-4 bg-green-500 rounded-xl text-white font-semibold px-4 py-2
          shadow-md hover:bg-green-600 cursor-pointer transition-all duration-200 "
            disabled={loading}  >
                {loading ? "Sending OTP..." : "Mark As Delivered"}
              </button>
            ) : (
              <div className="t-4 p-4 border rounded-xl bg-gray-50">
                <p className="text-md font-semibold mb-2">
                  Enter OTP send to
                  <span className="text-orange-500">
                    {" "}
                    {currentOrder?.user.name}
                  </span>
                </p>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none
            focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter Otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={verifyOtp} 
                  className="w-full  bg-green-500 rounded-xl text-white font-semibold px-4 py-2
          shadow-md hover:bg-green-600 cursor-pointer transition-all duration-200 "
                >
              Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DelBoy;
