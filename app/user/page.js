"use client"; 

import React, { useEffect, useState } from 'react'
import useGetUser from '../hooks/useGetUser';
import UserInfosCheckoutForm from '../components/UserInfosCheckoutForm';
import {updateUserInfos } from '@/app/admin/users/_actions/users'; 
import { getOrdersByUserId } from '@/app/admin/users/_actions/users';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

function UserPage() {
  let {user, error, loading, fetchUser} = useGetUser();
  const [currentPage, setCurrentPage] = useState(0) 

if(error){
    return(
        <>
        <div>an Error Occurred</div>
        <Link className="text-white bg-black p-2" href={'/'}>Home</Link>
        </>
    )
}
  return (
    <>
    <nav className='navigation flex gap-2'>
        <div onClick={()=>setCurrentPage(0)} className={!currentPage? "font-bold" : "font-normal"}> Your Order</div>
        <div onClick={()=>setCurrentPage(1)} className={currentPage ? "font-bold" : "font-normal"}>Settings</div>
    </nav>
    <div className='page-ctn w-[50vw]'>
      {!currentPage ? <YouOrderPage userId={user?._id}/> : <Settings user={user} fetchUser={fetchUser}/>}
    </div>
    </>
  )
}

 function YouOrderPage({userId}){
  return(
    <p className='text-white'>My Order</p>

  )
}


function Settings({ user, fetchUser }) {
  const [isEditPage, setIsEditPage] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        street: user.address.street,
        city: user.address.city,
        postcode: user.address.postcode,
        country: user.address.country,
        phone: user.phone
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const {error, message } = await updateUserInfos(user._id, data); 
    if(error){
      setError(error)
      return
    }else{
      console.log(message)
      fetchUser()
      setIsEditPage(false)
    }
    
  }

  const handleClick = async () => {
    setError("")
    const isValid = await trigger();
    if (isValid) {
      await handleSubmit(onSubmit)();
    } 
  }

  return (
    <>
      <p className='text-white'>Settings</p>
      <div className='user-infos'>
        <div className={isEditPage ?'flex justify-start':'flex justify-end'}>
          {isEditPage ?<button onClick={() => setIsEditPage(false)} className='text-white bg-black p-1'>Back</button>:<button onClick={() => setIsEditPage(true)} className='text-black bg-gray-200 p-1'>Edit</button>}
        </div>
        {isEditPage ? <UserInfosCheckoutForm register={register} errors={errors} user={user} /> : <UserinfosPage user={user} />}
        {isEditPage && <button className='w-full bg-black text-white p-4' onClick={handleClick}>Edit</button>}
      </div>
      {error && <p className='bg-red-500 text-white p-2'>{error}</p>}
    </>
  );
}



function UserinfosPage({user}){
  return(
    <>
    <h2>Your informations</h2>
    <div>
            <div className="mb-4">
                <p className="font-semibold">First Name</p>
                <p>{user.firstname}</p>
                <p className="font-semibold">Last Name</p>
                <p>{user.lastname}</p>
            </div>
            <div className="mb-4">
                <p className="font-semibold">Email</p>
                <p>{user.email}</p>
            </div>
            <div className="mb-4">
                <p className="font-semibold">Address</p>
                <p>{user.address.street}</p>
                <p>{user.address.city}, {user.address.postcode}</p>
                <p>{user.address.country}</p>
            </div>
            <div>
                <p className="font-normal">Phone Number</p>
                <p>{user.phone}</p>
            </div>
        </div>
    </>
  )
}



export default UserPage; 