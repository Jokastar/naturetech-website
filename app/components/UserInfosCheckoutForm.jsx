import React from 'react';
import Link from 'next/link';

function UserInfosCheckoutForm({errors, register}) {
 
  return (
  <form className="w-full">
    <div className='my-4'>
      <div className='contact-header flex justify-between'>
      <h2 className='mb-2'>Contact</h2>
      <Link href={"/login"} className="underline cursor-pointer text-sm font-medium">Log In</Link>
      </div>
      <div className="mb-2 relative">
      <label htmlFor="email" className="text-gray-400 absolute top-1 left-[9px] text-[12px]">Email</label>
      <input
      id="email"
      type='email'
      {...register('email', { required: 'Email is required' })}
      className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-gray-300 text-[12px]"
    />
    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
  </div>
  <div className="mb-2 flex space-x-2">
    <div className="w-1/2 min-h-3 relative">
      <label htmlFor="firstName" className="text-gray-400 absolute top-[7px] left-[9px] text-[12px]">First Name</label>
      <input
        id="firstName"
        {...register('firstName', { required: 'First Name is required' })}
        className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-gray-300 text-[12px]"/>
      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
    </div>
    <div className="w-1/2 relative">
      <label htmlFor="lastName" className="text-gray-400 absolute top-[7px] left-[9px] text-[12px]">Last Name</label>
      <input
        id="lastName"
        {...register('lastName', { required: 'Last Name is required' })}
        className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-gray-300 text-[12px]"
      />
      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
    </div>
  </div>
  </div>
  <h2 className='mb-2'>Delivery</h2>
  
  <div className="mb-2 relative">
    <label htmlFor="Country" className="text-gray-400 absolute top-1 left-[9px] text-[12px]">Country</label>
    <input
      id="address"
      {...register('country', { required: 'country is required' })}
      className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-gray-300 text-[12px]"
    />
    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
  </div>
  <div className="mb-2 relative">
    <label htmlFor="address" className="text-gray-400 absolute top-1 left-[9px] text-[12px]">Address</label>
    <input
      id="address"
      {...register('address', { required: 'Address is required' })}
      className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-gray-300 text-[12px]"
    />
    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
  </div>

  <div className="mb-2 flex space-x-2">
    <div className="w-1/2 relative">
      <label htmlFor="city" className="text-gray-400 absolute top-[7px]  left-[9px] text-[12px]">City</label>
      <input
        id="city"
        {...register('city', { required: 'City is required' })}
        className="px-2 pt-[20px] pb-[6px] block w-full border border-gray-300 text-[12px]"
      />
      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
    </div>
    <div className="w-1/2 relative">
      <label htmlFor="postalCode" className="text-gray-400 absolute top-[7px]  left-[9px] text-[12px]">Postal Code</label>
      <input
        id="postalCode"
        {...register('postalCode', { required: 'Postal Code is required' })}
        className="px-2 pt-[20px] pb-[6px] block w-full border border-gray-300 text-[12px]"
      />
      {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
    </div>
  </div>
  <div className="mb-2 relative">
    <label htmlFor="phone" className="text-gray-400 absolute top-1 left-[9px] text-[12px]">Number</label>
    <input
      id="phone"
      type="phone"
      {...register('number', { required: 'Number is required' })}
      className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-gray-300 text-[12px]"
    />
    {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>}
  </div>
</form>

  );
}

export default UserInfosCheckoutForm;
