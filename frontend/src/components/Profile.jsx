import React from 'react'
import { useSelector } from 'react-redux'
import { FaUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const Profile = () => {
    const { userData } = useSelector(state => state.user);

    return (
        <div
            className='min-h-screen w-full flex justify-center items-center px-4 py-10'
            style={{ backgroundColor: "#fff9f6" }}
        >
            <div className='w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100 hover:scale-[1.01] transition-all duration-300'>

                {/* Top Section */}
                <div className='bg-gradient-to-r from-orange-500 to-orange-400 h-32 flex flex-col justify-center items-center relative'>

                    <div className='w-24 h-24 rounded-full bg-white absolute -bottom-12 flex items-center justify-center shadow-xl border-4 border-white'>
                        <FaUserCircle className='text-7xl text-orange-500' />
                    </div>

                </div>

                {/* Content */}
                <div className='pt-16 px-8 pb-8 text-center'>

                    <h1 className='text-3xl font-bold text-gray-800'>
                        {userData.user?.name}
                    </h1>

                    <p className='text-gray-500 mt-2'>
                        Welcome back to SpiceSprint 🍕
                    </p>

                    <div className='mt-8 flex flex-col gap-4'>

                        <div className='flex items-center gap-3 bg-orange-50 p-4 rounded-xl shadow-sm'>
                            <MdEmail className='text-2xl text-orange-500' />
                            <div className='text-left'>
                                <p className='text-sm text-gray-500'>Email</p>
                                <p className='font-semibold text-gray-700'>
                                    {userData.user?.email}
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 bg-orange-50 p-4 rounded-xl shadow-sm'>
                            <FaPhoneAlt className='text-xl text-orange-500' />
                            <div className='text-left'>
                                <p className='text-sm text-gray-500'>Mobile</p>
                                <p className='font-semibold text-gray-700'>
                                    {userData.user?.mobile}
                                </p>
                            </div>
                        </div>

                        <div className='bg-orange-50 p-4 rounded-xl shadow-sm'>
                            <p className='text-sm text-gray-500'>
                                Member Since
                            </p>
                            <p className='font-semibold text-gray-700'>
                                {new Date().toLocaleDateString()}
                            </p>
                        </div>

                    </div>

                    {/* Bottom Message */}
                    <div className='mt-8 bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-2xl border border-orange-200'>
                        <p className='text-gray-700 font-medium'>
                            Enjoy fast delivery, fresh meals, and exclusive offers every day 🚀
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Profile