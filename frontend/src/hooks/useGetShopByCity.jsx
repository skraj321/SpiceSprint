import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux';
import { setShopsInMyCity, setUserData } from '../redux/userSlice';
import { setShopData } from '../redux/adminSlice';

const useGetShopByCity = () => {
    const dispatch=useDispatch();
    const {currentCity} = useSelector((state)=>state.user)
  useEffect(() =>{
    if(!currentCity) return;
    const fetchShops = async() =>{
        try{
            const res = await axios.get(`${serverUrl}/api/get-by-city/${currentCity}`,{
                withCredentials: true
            });
            dispatch(setShopsInMyCity(res.data));
            console.log(res.data)
        }catch(err){
            console.error("Error fetching current user:", err);
        }
    }
    fetchShops();
  }, [currentCity])
}

export default useGetShopByCity
