import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { setShopData } from '../redux/adminSlice';

const useGetMyShop = () => {
    const dispatch=useDispatch();
  useEffect(() =>{
    const fetchShop = async() =>{
        try{
            const res = await axios.get(`${serverUrl}/api/get-shop`,{
                withCredentials: true
            });
            dispatch(setShopData(res.data));
            console.log(res.data)
        }catch(err){
            console.error("Error fetching current user:", err);
        }
    }
    fetchShop();
  }, [])
}

export default useGetMyShop
