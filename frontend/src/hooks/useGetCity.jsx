import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setState, setUserData } from "../redux/userSlice";
import { setCity } from "../redux/userSlice";
import { setCurrAddress, setLocation } from "../redux/mapSlice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  useEffect(() => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        dispatch(setLocation({ lat: latitude, long: longitude }));
        const res = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`,
        );
        const result = res?.data?.results?.[0];

        const cityName =
          result?.city ||
          result?.state_district ||
          result?.county ||
          result?.town ||
          result?.village;

        dispatch(setCity(cityName));
        dispatch(setState(result?.state));
        dispatch(setAddress(result?.address_line1));
        dispatch(setCurrAddress(result?.address_line2));
      }
     ,
  (error) => {
    console.log("Location Error:", error);
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  }
);
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  }, []);
};

export default useGetCity;
