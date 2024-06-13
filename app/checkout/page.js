"use client";

import React, { useState, useEffect } from 'react';
import checkout from './_actions/checkout';
import CheckoutForm from '../components/CheckoutForm';
import UserInfosCheckoutForm from '../components/UserInfosCheckoutForm';
import useGetUser from '../hooks/useGetUser';
import { useCart } from '../context/cartContext';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { formattedCurrency } from '../lib/currencyFormat';

function CheckoutPage() {
  let {user, error, isLoading, fetchUser} = useGetUser(); 
  const { items, totalAmount } = useCart();
  const [clientSecret, setClientSecret] = useState(null);
  const [userFormInfos, setuserFormInfos] = useState({}); 
  const { register, handleSubmit, formState: { errors }, trigger, reset} = useForm();
  const router = useRouter()
 

  useEffect(() => {
    const fetchClientSecret = async (userId) => {
      console.log(userId)
      try {
        const secret = await checkout(items,userId, totalAmount);
        setClientSecret(secret);
      } catch (error) {
        console.error("Checkout failed:", error);
      }
    };

    if (user && !error) {
      reset(
        {firstname:user.firstname,
        lastname:user.lastname,
        email:user.email,
        street:user.address?.street,
        city:user.address?.city,
        postcode:user.address?.postcode,
        country:user.address?.country,
        phone:user.phone || ""
        }
      )
      fetchClientSecret(user?._id)
    }
  }, [user, error, reset, items, totalAmount]);


const onSubmit = (data) =>{
  console.log("submitted data", data)
  setuserFormInfos(data); 
}
const isUserFormValid = async () =>{   
  const isValid = await trigger();
  if (isValid) {
    return true;
  }
  return false;
  }


  if (isLoading) {
    return <div>Loading...</div>;  // Render loading state while fetching clientSecret
  }

  if(error) {
    if(error === "ERR_JWT_EXPIRED"){
      router.push("/login?redirectTo=/checkout")
    }else{
      return(<p className='text-red-500'>{error}</p>)
    }
      
  }
  if(!totalAmount) router.push("/")

  return (
    <>
    {/* Checkout Form */}
    <div className='text-center uppercase font-test-sohne-breit text-xs p-4 text-white fixed z-10 w-full'><Link href={"/"}>German army trainers</Link></div>
    <div className='grid grid-cols-2 w-full h-[100vh]'>
      <div 
      className='checkout-form px-8 py-6 overflow-y-scroll text-[var(--black)]'
      style={{
        scrollbarWidth: 'none', // For Firefox
        msOverflowStyle: 'none' // For Internet Explorer and Edge
      }}
       >
      <div className='white-space h-20'></div>
      <div className='checkout-header flex justify-between text-sm my-4'>
        <p className='mb-3 uppercase font-test-sohne-breit '>Checkout</p>
        <div><Link href={"/shop"} className='underline'> Go back</Link></div>        
      </div>
      <div className='delivery-section my-4'>
      <UserInfosCheckoutForm  register={register} errors={errors}/>
      </div>
      <div className='shipping-section my-4'>
        <h2 className='mb-2 uppercase text-xs'>Shipping method</h2>
        <div className='flex bg-[var(--light-gray)] justify-between items-center p-3 '>
          <p className='text-[12px] font-medium uppercase'>free</p>
          <p className='text-[12px] '>free</p>
        </div>
      </div>
      <div className='payment-section text-x my-4'>
        <h2 className='mb-2 uppercase text-xs'>Payment</h2>
{       clientSecret && <CheckoutForm clientSecret={clientSecret} isUserFormValid={isUserFormValid} totalAmount={formattedCurrency(totalAmount)}  userId = {user?._id} userFormInfos={userFormInfos} onUserFormSubmit={handleSubmit}/>
}      </div> 
      </div>

      {/* Order recap*/}

     <div className='order-recap bg-[var(--black)] text-[var(--dark-gray)] relative flex flex-col px-8 py-6'>
     <div className='white-space h-20'></div>
      <div className='orders'>
      <h2 className='mb-4 font-test-sohne-breit text-sm uppercase'>My order</h2>
        {items?.map(item => (
       <>
      <div key={item.name} className='flex gap-7 border-y border-[var(--dark-gray)] mb-5 py-5 text-xs font-test-sohne-mono'>
        <div className="img-ctn relative border-r-1 border-[var(--dark-gray)]">
            <img src={item.productImageMiniature} alt={item.name} className='w-[100px] object-cover'/>
            <div className='absolute top-[-10px] right-[-10px] h-6 w-6 flex items-center justify-center rounded-[50%] bg-[var(--dark-gray)] text-white'><span className='text-xs'>{item.quantity}</span></div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
        <div className='flex justify-between items-start '>
        <p>{item.name}</p>
        <p>{formattedCurrency(item.priceInCents)}</p>
        </div>
        <p>Size {item.size}</p>
        </div>
      </div>
      </>
    ))} 
      </div>
        
    <div className='total-checkout uppercase text-xs'>
          <div className='flex justify-between items-center mt-6'>
            <p>Subtotal</p>
            <p>{formattedCurrency(totalAmount)}</p>
          </div>
          <div className='flex justify-between items-center my-2'>
            <p>Shipping</p>
            <p>FREE</p>
          </div>
          <div className='flex justify-between items-center mt-8 text-md'>
            <p className='text-[16px] font-medium'>Total</p>
            <p className='text-[20px] font-medium'>{formattedCurrency(totalAmount)}</p>
          </div>       
        </div>
     </div> 
    </div>
    </>
  );
}

export default CheckoutPage;

