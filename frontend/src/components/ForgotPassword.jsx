import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [step,setStep]=useState(1);
    const [email,setEmail]=useState("")
  const [otp,setOtp]=useState("")
  const [newPassword,setNewPassword]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const [err,setErr]=useState("")
  const navigate=useNavigate()
  const [loading,setLoading]=useState(false)

  const handleSendOtp=async()=>{
    try{
      const res= await axios.post(`${serverUrl}/api/send-otp`,{email},{
        withCredentials: true
      });
      console.log(res);
      toast.success("OTP sent successfully! Please check your email.");
      setStep(2);
    }catch(err){
      console.error("Error during sending OTP:", err);
      toast.error("Failed to send OTP");
    }
  }

    const verifyOtpp=async()=>{
      try{
        const res= await axios.post(`${serverUrl}/api/verify-otp`,{email,otp},{
          withCredentials: true
        });
        console.log(res);
        toast.success("OTP verified successfully! You can now reset your password.");
        setStep(3);
      }catch(err){
        console.error("Error during OTP verification:", err);
        toast.error("Failed to verify OTP");
      }
    }

    const handleChangePassword=async()=>{
      try{
        if(newPassword !== confirmPassword){
          toast.error("Passwords do not match");
          return;
        }
        const res= await axios.post(`${serverUrl}/api/reset-password`,{email,newPassword},{
          withCredentials: true
        });
        console.log(res);
        toast.success("Password reset successful! Please login with your new password.");
        navigate("/signin");
      }catch(err){
        console.error("Error during password reset:", err);
        toast.error("Failed to reset password");
      }
    }
  return (
    <div className='flex w-full items-center justify-center
    min-h-screen p-4 bg-[#fff9f6]'>
        <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
            <div>
                <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] cursor-pointer' onClick={()=>navigate("/signin")}/>
                <h1>Forgot password</h1>
            </div>
             {step == 1
          &&
          <div>
 <div className='mb-6'>
                    <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                    <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                </div>
                <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleSendOtp} disabled={loading}>
                {loading?<ClipLoader size={20} color='white'/>:"Send Otp"}
            </button>
                 {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
          </div>}
            {step == 2
          &&
          <div>
 <div className='mb-6'>
                    <label htmlFor="otp" className='block text-gray-700 font-medium mb-1'>OTP</label>
                    <input type="text" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Enter OTP' onChange={(e)=>setOtp(e.target.value)} value={otp} required/>
                </div>
                <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={verifyOtpp} disabled={loading}>
                {loading?<ClipLoader size={20} color='white'/>:"Verify"}
            </button>
                 {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
          </div>}

           {step == 3
          &&
          <div>
 <div className='mb-6'>
                    <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                    <input type="password" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Enter new password' onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} required/>
                </div>
                 <div className='mb-6'>
                    <label htmlFor="confirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
                    <input type="password" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Confirm password' onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} required/>
                </div>
                <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleChangePassword} disabled={loading}>
                {loading?<ClipLoader size={20} color='white'/>:"Reset Password"}
            </button>
                 {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
          </div>}
        </div> 
    </div>
  )
}

export default ForgotPassword
