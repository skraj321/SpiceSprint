import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const useGetCurrentUser = () => {
    const dispatch=useDispatch();
  useEffect(() =>{
    const fetchUser = async() =>{
        try{
            const res = await axios.get(`${serverUrl}/api/me`,{
                withCredentials: true
            });
            dispatch(setUserData(res.data));
        }catch(err){
            console.error("Error fetching current user:", err);
        }
    }
    fetchUser();
  }, [])
}

export default useGetCurrentUser
