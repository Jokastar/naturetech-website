"use client";

import React, { useState, useEffect } from 'react'; 
import { useCart } from '../context/cartContext';
import checkout from './_actions/checkout';
import CheckoutForm from '../components/CheckoutForm';
import UserInfosCheckoutForm from '../components/UserInfosCheckoutForm';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';


function CheckoutPage() {
  const { items, totalAmount } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [userAddress, setUserAddress] = useState({}); 
  const { register, handleSubmit, formState: { errors }, trigger } = useForm();
  const router = useRouter(); 


const onSubmit = (data) =>{
  console.log(data)
  setUserAddress(data); 
}
  const isUserFormValid = async () =>{   
      const isValid = await trigger();
      console.log(isValid);  
      if(!isValid)return false;
      handleSubmit(onSubmit)()
      return true
  }



  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const secret = await checkout(items, 6000);
        setClientSecret(secret);
      } catch (error) {
        console.error("Checkout failed:", error);
      }
    };

    fetchClientSecret();
  }, [items, totalAmount]);

  if (!clientSecret) {
    return <div>Loading...</div>;  // Render loading state while fetching clientSecret
  }

  return (
    <div className='grid grid-cols-[55%_45%] w-full h-[100vh]'>
      <div className='checkout-form mx-8'>
      <div className='checkout-header mb-6'>
        <p>BRAND NAME</p>
      </div>
      <div className='delivery-section my-4'>
      <UserInfosCheckoutForm  register={register} errors={errors}/>
      </div>
      <div className='shipping-section my-4'>
        <h2 className='mb-2'>Shipping Method</h2>
        <div className='flex bg-gray-100 justify-between items-center p-3 '>
          <p className='text-[12px] font-medium text-gray-500 uppercase'>free</p>
          <p className='text-[12px] text-gray-500'>free</p>
        </div>
      </div>
      <div className='payment-section my-4'>
        <h2 className='mb-2'>Payment</h2>
      <CheckoutForm clientSecret={clientSecret} isUserFormValid={isUserFormValid}/>
      </div> 
      </div>
     <div className='order-recap bg-gray-100 relative flex flex-col p-6'>
      <div className='orders'>
      <h2 className='mb-4'>My order</h2>
        {items?.map(item => (
      <div key={item.name} className='flex gap-5 border-b-1 border-black mb-5 '>
        <div className="img-ctn relative">
            <img src={item.imagePath} alt={item.name} className='w-[100px] h-[100px] object-cover bg-slate-300'/>
            <div className='absolute top-[-10px] right-[-10px] h-6 w-6 bg-black text-white flex items-center justify-center rounded-[50%]'><span className='text-xs'>{item.quantity}</span></div>
        </div>
        <div className='flex justify-between items-start w-full'>
        <p>{item.name}</p>
        <p>${item.priceInCents}</p>
        </div>
        
      </div>
    ))} 
      </div>
        
    <div className='total-checkout text-[12px] text-gray-600'>
          <div className='flex justify-between items-center mt-6'>
            <p>Subtotal</p>
            <p className='text-[1rem]'>${totalAmount || 6000}</p>
          </div>
          <div className='flex justify-between items-center my-2'>
            <p>Shipping</p>
            <p>FREE</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-[16px] font-medium'>Total</p>
            <p className='text-[20px] font-medium'>${totalAmount || 6000}</p>
          </div>       
        </div>
     </div> 
    </div>
  );
}

export default CheckoutPage;

