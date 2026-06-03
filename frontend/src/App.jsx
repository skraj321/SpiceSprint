import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Homepage from "./components/Homepage";
import { useEffect } from "react";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import ForgotPassword from "./components/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGetCity from "./hooks/useGetCity";
import Profile from "./components/Profile";
import useGetMyShop from "./hooks/useGetMyShop";
import AddShop from "./components/AddShop";
import AddItem from "./components/AddItem";
import EditItem from "./components/EditItem";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemByCity from "./hooks/useGetItemByCity";
import CartPage from "./components/CartPage";
import CheckOut from "./components/CheckOut";
import PlacedOrder from "./components/PlacedOrder";
import MyOrders from "./components/MyOrders";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";
import TrackOrder from "./pages/TrackOrder";
import Shop from "./pages/Shop";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { setSocket } from "./redux/userSlice";

export const serverUrl = "https://spicesprint-backend.onrender.com";
function App() {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemByCity();
  useGetMyOrders();
  useUpdateLocation();
  
  const {socket, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);

useEffect(() => {
  const socket = io(serverUrl, {
    withCredentials: true,
  });

  dispatch(setSocket(socket));

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  return () => socket.disconnect();
}, []);
useEffect(() => {
  if (socket && userData?.user?._id) {
    socket.emit("identity", userData.user._id);
  }
}, [socket, userData]);
  

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} theme="colored" className="z-9999" />
      <Router>
        <Routes>
          <Route path="/" element={!userData ? <SignIn /> : <Homepage />}>
            {" "}
          </Route>
          <Route path="/signup" element={<SignUp />}>
            {" "}
          </Route>
          <Route path="/signin" element={<SignIn />}>
            {" "}
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />}>
            {" "}
          </Route>
          <Route path="/profile" element={userData ? <Profile /> : <SignIn/>} >
          {" "}
          </Route>
          <Route path="/add-shop" element={userData ? <AddShop /> : <SignIn/>} >
          {" "}
          </Route>
          <Route path="/add-item" element={userData ? <AddItem /> : <SignIn/>} >
          {" "}
          </Route>
          <Route path="/edit-item/:itemId" element={userData ? <EditItem /> : <SignIn/>} >
          {" "}
          </Route>
          <Route path="/cart" element={userData ? <CartPage /> : <SignIn/>} >
          {" "}
          </Route>
          <Route path="/check-out" element={userData ? <CheckOut /> : <SignIn/>} >
          {" "}
          </Route>
          <Route path="/placed-order" element={userData ? <PlacedOrder /> : <SignIn/>} >
          {" "}
          </Route>
          <Route path="/my-orders" element={userData ? <MyOrders /> : <SignIn/>} >
          {" "}
          </Route>
          <Route path="/track-order/:orderId" element={userData ? <TrackOrder /> : <SignIn/>} >
          {" "}
          </Route>
          <Route path="/shop/:shopId" element={userData ? <Shop /> : <SignIn/>} >
          {" "}
          </Route>
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
