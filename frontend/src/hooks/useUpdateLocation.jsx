import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setState, setUserData } from "../redux/userSlice";
import { setCity } from "../redux/userSlice";
import { setCurrAddress, setLocation } from "../redux/mapSlice";

const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const updateLocation = async (lat, long) => {
         try {
      const res = await axios.post(`${serverUrl}/api/update-location`, { lat, long }, {
        withCredentials: true
      });
      console.log("Location updated successfully:", res.data);
    } catch (err) {
      console.error("Error fetching location:", err);
    }
    }
    navigator.geolocation.watchPosition((position)=>{
        updateLocation(position.coords.latitude, position.coords.longitude);
    })
  }, [userData]);
};

export default useUpdateLocation;
