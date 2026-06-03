import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setCurrAddress, setLocation } from "../redux/mapSlice";
import { addMyOrder, setAddress } from "../redux/userSlice";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa6";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

function RecenterMap({ location }) {
  if (location.lat && location.long) {
    const map = useMap();
    map.setView([location.lat, location.long], 16, { animate: true });
  }
  return null;
}
const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, totalAmount, userData } = useSelector(
    (state) => state.user,
  );
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [addressInput, setAddressInput] = useState("");
  const { location, address } = useSelector((state) => state.map);
  const delFee = totalAmount > 500 ? 0 : 40;
  const amtWithDel = totalAmount + delFee;
  const onDragEnd = (e) => {
    dispatch(
      setLocation({ lat: e.target._latlng.lat, long: e.target._latlng.lng }),
    );
    getAddressByCoords();
  };
  const getCurrentLocation = () => {
    const latitude = userData.user.location.coordinates[1];
    const longitude = userData.user.location.coordinates[0];
    dispatch(setLocation({ lat: latitude, long: longitude }));
    getAddressByCoords();
  };
  const getAddressByCoords = async () => {
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.long}&format=json&apiKey=${apiKey}`,
      );
      const data = await res.json();
      dispatch(setCurrAddress(data?.results[0].address_line2));
    } catch (err) {
      console.log(err);
    }
  };
  const getLatLongByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`,
      );
      dispatch(
        setLocation({
          lat: result?.data?.features[0].properties.lat,
          long: result?.data?.features[0].properties.lon,
        }),
      );
    } catch (err) {
      console.log(err);
    }
  };
  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/place-order`,
        {
          paymentMethod,
          delAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.long,
          },
          totalAmount: amtWithDel,
          cartItems,
        },
        {
          withCredentials: true,
        },
      );
      if (paymentMethod == "cod") {
        dispatch(addMyOrder(result.data));
        toast.success("Order Placed Successfully", {
          className: "!mt-16 !bg-orange-50 !text-orange-600",
          progressClassName: "!bg-orange-500",
        });
        navigate("/placed-order");
      }else{
        const orderId=result.data.orderId
        const razorOrder=result.data.razorOrder
        openRazorPayWindow(orderId,razorOrder)
      }
    } catch (err) {
      console.log(err);
    }
  };
  const openRazorPayWindow=(orderId,razorOrder)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:razorOrder.amount,
      currency:'INR',
      name:"SpiceSprint",
      description:"Food Delivery Website",
      order_id:razorOrder.id,
      handler:async function(response){
        try{
          const result=await axios.post(`${serverUrl}/api/verify-payment`,{
            razorpay_payment_id:response.razorpay_payment_id,
            orderId
          },{
            withCredentials:true
          })
          dispatch(addMyOrder(result.data));
        toast.success("Order Placed Successfully", {
          className: "!mt-16 !bg-orange-50 !text-orange-600",
          progressClassName: "!bg-orange-500",
        });
        navigate("/placed-order");
        }catch(err){
          console.log(err)
        }
      },
      
    }
    const rzp=new window.Razorpay(options)
    rzp.open()
  }
  useEffect(() => {
    setAddressInput(address);
  }, [address]);
  return (
    <div
      className="min-h-screen bg-amber-50 flex items-center
    justify-center p-6"
    >
      <div
        className="absolute top-5 left-5 z-10 "
        onClick={() => navigate("/cart")}
      >
        <IoMdArrowBack size={35} className="text-orange-400" />
      </div>
      <div
        className="w-full max-w-225 bg-white rounded-2xl
      shadow-xl p-6 space-y-6 "
      >
        <h1 className="text-2xl font-bold text-gray-800">CheckOut</h1>
        <section>
          <h2
            className="text-lg font-semibold mb-2 flex items-center
            gap-2 text-gray-800"
          >
            <FaLocationDot className="text-orange-500" />
            Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300
    rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="Enter Your Delivery Address.."
              value={addressInput || ""}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button
              onClick={getLatLongByAddress}
              className="bg-orange-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg
            flex items-center justify-center"
            >
              <IoMdSearch />
            </button>
            <button
              onClick={getCurrentLocation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg 
            flex items-center justify-center"
            >
              <TbCurrentLocation />
            </button>
          </div>
          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className="h-full w-full"
                center={[location?.lat, location?.long]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[location?.lat, location?.long]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                ></Marker>
                <RecenterMap location={location} />
              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition cursor-pointer ${paymentMethod === "cod" ? "border-green-500 bg-green-50 shadow" : "border-gray-300 hover:border-gray-400"}`}
            >
              <span
                className="inline-flex h-10 w-10 items-center
              justify-center rounded-full bg-green-100 "
              >
                <MdDeliveryDining />
              </span>
              <div>
                <p className="font-medium text-gray-800">Cash on Delivery</p>
                <p className="text-xs text-gray-600">
                  Pay when your order is delivered
                </p>
              </div>
            </div>
            <div
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition cursor-pointer ${paymentMethod === "online" ? "border-green-500 bg-green-50 shadow" : "border-gray-300 hover:border-gray-400"}`}
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center
              rounded-full bg-purple-100"
              >
                <FaMobileAlt />
              </span>
              <span
                className="inline-flex h-10 w-10 items-center justify-center
              rounded-full bg-blue-100"
              >
                <FaCreditCard />
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  UPI / Credit / Dabit Card
                </p>
                <p className="text-xs text-gray-600">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2
            className="text-lg font-semibold mb-3
          text-gray-800"
          >
            Order Summary
          </h2>
          <div className="rounded-xl p-3 border bg-gray-50 space-y-2">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-700"
              >
                <p className="font-medium text-xl text-gray-800">{item.name}</p>
                <span className="text-gray-700 font-medium text-lg">
                  ₹{item.price} x {item.quantity}
                </span>
                <span className="text-gray-800 font-semibold text-lg">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
            <hr className="border-gray-400 my-2" />
            <div className="flex justify-between font-medium text-gray-800">
              <span>SubTotal</span>
              <span>{totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>{delFee == 0 ? "Free" : `₹${delFee}`}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold text-orange-500 pt-2">
              <span>Total</span>
              <span>{amtWithDel}</span>
            </div>
          </div>
        </section>
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-500 hover:bg-orange-600
        text-white py-2 rounded-xl font-semibold cursor-pointer"
        >
          {paymentMethod == "cod" ? "Place Order" : "Proceed to payment"}
        </button>
      </div>
    </div>
  );
};

export default CheckOut;
