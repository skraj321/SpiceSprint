import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux';
import { setItemsInMyCity, setShopsInMyCity, setUserData } from '../redux/userSlice';
import { setShopData } from '../redux/adminSlice';

const useGetItemByCity = () => {
    const dispatch=useDispatch();
    const {currentCity} = useSelector((state)=>state.user)
  useEffect(() =>{
    if(!currentCity) return;
    const fetchItems = async() =>{
        try{
            const res = await axios.get(`${serverUrl}/api/get-item-bycity/${currentCity}`,{
                withCredentials: true
            });
            dispatch(setItemsInMyCity(res.data));
            console.log(res.data)
        }catch(err){
            console.error("Error fetching current user:", err);
        }
    }
    fetchItems();
  }, [currentCity])
}

export default useGetItemByCity
