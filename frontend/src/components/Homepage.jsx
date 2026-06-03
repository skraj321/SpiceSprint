import React from 'react'
import UserDash from '../pages/UserDash'
import AdminDash from '../pages/AdminDash'
import DelBoy from '../pages/DelBoy'
import { useSelector } from 'react-redux'

const Homepage = () => {
  const {userData} = useSelector(state=>state.user);
  const userRole = userData.user.role;
  return (
    <div className='w-screen min-h-25 pt-25 flex flex-col items-center
    bg-amber-50'>
      {userRole === "user" && <UserDash/> }
      {userRole === "admin" && <AdminDash/> }
      {userRole === "deliveryBoy" && <DelBoy/> }
    </div>
  )
}

export default Homepage
