import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { setShopData } from '../redux/adminSlice';

const useGetMyShop = () => {
    const dispatch=useDispatch();
    const {userData} = useSelector((state)=>state.user)
  useEffect(() =>{
    const fetchShop = async() =>{
        try{
            const res = await axios.get(`${serverUrl}/api/get-shop`,{
                withCredentials: true
            });
            dispatch(setShopData(res.data));
        }catch(err){
            console.error("Error fetching current user:", err);
        }
    }
    fetchShop();
  }, [userData])
}

export default useGetMyShop
