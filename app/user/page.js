"use client";

import React, { useEffect, useState } from 'react';
import { getUser } from '@/app/admin/users/_actions/users';
import useGetUser from "../hooks/useGetUser"
import UserInfosCheckoutForm from '../components/UserInfosCheckoutForm';
import { updateUserInfos } from '@/app/admin/users/_actions/users';
import { useForm } from 'react-hook-form';
import Link from 'next/link';


function UserPage() {
  const {user, isLoading, error} = useGetUser(); 
  const [currentPage, setCurrentPage] = useState(0);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <>
        <div className="text-red-500">{error}</div>
        <Link className="text-white bg-black p-2" href={'/'}>Home</Link>
      </>
    );
  }


  return (
    <>
      <nav className='navigation flex gap-2'>
        <div onClick={() => setCurrentPage(0)} className={!currentPage ? "font-bold" : "font-normal"}>Your Order</div>
        <div onClick={() => setCurrentPage(1)} className={currentPage ? "font-bold" : "font-normal"}>My informations</div>
      </nav>
      <div className='page-ctn w-[50vw]'>
        {!currentPage ? <YourOrderPage orders={user?.orders}/> : <SettingsPage user={user} getUser={getUser} />}
      </div>
    </>
  );
}

function YourOrderPage({orders}) {
  console.log(orders)
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (orders && orders.length === 0) {
    return <div>No orders</div>;
  }

  return (
  <>
  <h2>Your Orders</h2>
<div className="overflow-x-auto">
  <table className="table">
    <thead>
      <tr>
        <th>Order Id</th>
        <th>Total</th>
        <th>Created At</th>
        <th>Products</th>
      </tr>
      {orders?.map(order => (
        <tr key={order._id}>
        <td>{order._id}</td>
        <td>${order.pricePaidInCents}</td>
        <td>{formatDate(order.createdAt)}</td>
        {order.products.map(product =>(
          <td key={product.productId._id}>
            <div>
              <div className='bg-gray-300 w-[60px] h-[60px}'>
                <img src={product.productId.imagePath} className='object-cover'/>
              </div> 
            <p className='text-[10px]'>{product.productId.name}</p>
            <p className='text-[10px]'>{`qte ${product.quantity}`}</p>
            </div>
          </td>
        ))}
      </tr>
      ))}
    </thead>
    <tbody>
    </tbody>
  </table>
</div>
</>
  );
}

function SettingsPage({ user, getUser }) {
  const [isEditPage, setIsEditPage] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        street: user.address.street || "",
        city: user.address.city || "",
        postcode: user.address.postcode || "",
        country: user.address.country || "",
        phone: user.phone || ""
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const { error, message } = await updateUserInfos(user._id, data);
    if (error) {
      setError(error);
      return;
    } else {
      console.log(message);
      getUser();
      setIsEditPage(false);
    }
  };

  const handleClick = async () => {
    setError("");
    const isValid = await trigger();
    if (isValid) {
      await handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <p className='text-white'>My informations</p>
      <div className='user-infos'>
        <div className={isEditPage ? 'flex justify-start' : 'flex justify-end'}>
          {isEditPage ? <button onClick={() => setIsEditPage(false)} className='text-white bg-black p-1'>Back</button> : <button onClick={() => setIsEditPage(true)} className='text-black bg-gray-200 p-1'>Edit</button>}
        </div>
        {isEditPage ? <UserInfosCheckoutForm register={register} errors={errors} user={user} /> : <UserInfosPage user={user} />}
        {isEditPage && <button className='w-full bg-black text-white p-4' onClick={handleClick}>Save</button>}
      </div>
      {error && <p className='bg-red-500 text-white p-2'>{error}</p>}
    </>
  );
}

function UserInfosPage({ user }) {
  return (
    <>
      <h2>Your Information</h2>
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
          <p className="font-semibold">Phone Number</p>
          <p>{user.phone}</p>
        </div>
      </div>
    </>
  );
}

function OrderTableRow({order}){
  console.log("individual order ",order)
  return (
    <tr>
    <th>{order._id}</th>
    <td>{order._priceInCents}</td>
    <td>{order.createdAt}</td>
    {order.products.map(product =>(
      <td key={product._id}>
        <div>
          <img src={product.productId.imagePath} className='w-[60px] h-[60px} object-cover'/>
        <p className='text-[8px]'>{product.productId.name}</p>
        <p>{`Qte ${product.productId.quantity}`}</p>
        </div>
      </td>
    ))}
  </tr>
  )
}

export default UserPage;
