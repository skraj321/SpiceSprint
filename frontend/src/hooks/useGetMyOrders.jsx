import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux';
import { setMyOrders, setUserData } from '../redux/userSlice';


const useGetMyOrders = () => {
    const dispatch=useDispatch();
    const {userData} = useSelector(state => state.user);
  useEffect(() =>{
    const fetchOrders = async() =>{
        try{
            const res = await axios.get(`${serverUrl}/api/my-orders`,{
                withCredentials: true
            });
            dispatch(setMyOrders(res.data.orders));
            console.log(res.data)
        }catch(err){
            console.error("Error fetching current user:", err);
        }
    }
    fetchOrders();
  }, [userData])
}

export default useGetMyOrders
