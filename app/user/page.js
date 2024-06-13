"use client";

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getUser } from '@/app/admin/users/_actions/users';
import useGetUser from "../hooks/useGetUser";
import UserInfosCheckoutForm from '../components/UserInfosCheckoutForm';
import { updateUserInfos } from '@/app/admin/users/_actions/users';
import { changePassword } from '../login/_actions/login';
import { useForm } from 'react-hook-form';
import Link from 'next/link';


function UserPage() {
  const { user, isLoading, error } = useGetUser();
  const [isEditPage, setIsEditPage] = useState(false);
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        postcode: user.address?.postcode || "",
        country: user.address?.country || "",
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
      getUser();
      setIsEditPage(false);
    }
  };

  const handleClick = async () => {
    const isValid = await trigger();
    if (isValid) {
      await handleSubmit(onSubmit)();
    }
  };

  if (isLoading || !user) {
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
    <Header/>
    <div className='user-page text-[var(--black)] text-sm p-8'>
      <div className='white_space h-[10vh]'></div>
      <h2 className='my-4 font-test-sohne-breit text-[1rem]'>My Profile</h2>
      <div className='user-infos grid grid-cols-2 gap-6'>
        {isEditPage ? (
          <div>
            <UserInfosCheckoutForm register={register} errors={errors} />
            <div className="flex justify-between gap-4">
              <button className=' w-full bg-[var(--black)] text-white p-4' onClick={()=> setIsEditPage(false)}>Cancel</button>
              <button className='w-full bg-[var(--green)] text-white px-4 py-3 font-test-sohne-breit text-sm' onClick={handleClick}>Save</button>
            </div>
          </div>
        ) : (
          <>
              <div className='flex flex-col'>
  <div className="input_row flex justify-between border-b my-4 border-[var(--black)]">
    <div className="flex gap-4">
      <label className='font-bold' style={{ minWidth: '100px' }}>Firstname</label>
      <p>{user.firstname}</p>
    </div>
    <div className='flex gap-4'>
      <label className='font-bold' style={{ minWidth: '100px' }}>Lastname</label>
      <p>{user.lastname}</p>
    </div>
  </div>
  <div className='flex gap-4 border-b my-4 border-[var(--black)]'>
    <label className='font-bold' style={{ minWidth: '100px' }}>Email</label>
    <p>{user.email}</p>
  </div>
  <div className='flex gap-4 border-b my-4 border-[var(--black)]'>
    <label className='font-bold' style={{ minWidth: '100px' }}>Address</label>
    <p>{user.address?.street}</p>
  </div>
  <div className="input_row flex justify-between border-b my-4 border-[var(--black)]">
    <div className="flex gap-4">
      <label className='font-bold' style={{ minWidth: '100px' }}>Postcode</label>
      <p>{user.address?.postcode}</p>
    </div>
    <div className='flex gap-4'>
      <label className='font-bold' style={{ minWidth: '100px' }}>City</label>
      <p>{user.address?.city}</p>
    </div>
  </div>
  <div className='flex gap-4 border-b my-4 border-[var(--black)]'>
    <label className='font-bold' style={{ minWidth: '100px' }}>Country</label>
    <p>{user.address?.country}</p>
  </div>
  <div className='flex gap-4 border-b my-4 border-[var(--black)]'>
    <label className='font-bold' style={{ minWidth: '100px' }}>Phone</label>
    <p>{user.phone}</p>
  </div>
</div>
    <div className='edit_btn'>
      <div className='flex flex-col mt-4 gap-2 w-[250px]'>
        <button onClick={() => setIsEditPage(!isEditPage)} className='bg-[var(--black)] text-[var(--light-gray)] p-2'>
          {isEditPage ? 'Cancel' : 'Modify profile'}
        </button>
        <button onClick={() => setIsPasswordChange(!isPasswordChange)} className='bg-[var(--black)] text-[var(--light-gray)] p-2'>
          Change password
        </button>
        {isPasswordChange && <ChangePasswordForm userId={user._id} setIsPasswordChange={setIsPasswordChange} />}
      </div>
    </div>
          </>
        )}
      </div>

      <h2 className='my-4 font-test-sohne-breit text-[1rem]'>My Orders</h2>
      <YourOrderPage orders={user?.orders} />
    </div>
    </>
  );
}

function YourOrderPage({ orders }) {
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (orders && orders.length === 0) {
    return <div>No orders</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Total</th>
              <th>Created At</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>${order.pricePaidInCents / 100}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  {order.products.map(product => (
                    <div key={product.productId._id} className='flex flex-col items-center'>
                      <div className='bg-gray-300 w-[60px] h-[60px]'>
                        <img src={product.productId.imagePath} className='object-cover w-full h-full' />
                      </div>
                      <p className='text-[10px]'>{product.productId.name}</p>
                      <p className='text-[10px]'>{`Qty ${product.quantity}`}</p>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const ChangePasswordForm = ({ userId, setIsPasswordChange }) => {
  const [formState, action] = useFormState(changePassword, {});

  useEffect(() => {
    if (formState.success) {
      console.log(formState.message);
      setIsPasswordChange(false);
    }
  }, [formState.success, setIsPasswordChange]);

  return (
    <form action={action} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="currentPassword" className="block text-gray-700">Current Password</label>
        <input
          id="currentPassword"
          name='currentPassword'
          type="password"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {formState.errors?.currentPassword && <p className="text-red-500 text-sm">{formState.errors.currentPassword}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
        <input
          id="newPassword"
          name='newPassword'
          type="password"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {formState.errors?.newPassword && <p className="text-red-500 text-sm">{formState.errors.newPassword}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-gray-700">Confirm New Password</label>
        <input
          id="confirmPassword"
          name='confirmPassword'
          type="password"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {formState.errors?.confirmPassword && <p className="text-red-500 text-sm">{formState.errors.confirmPassword}</p>}
      </div>

      {formState.errors && <p className="text-red-500 text-sm mb-4">{formState.errors}</p>}
      <input hidden name="userId" value={userId} />

      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Change Password</button>
    </form>
  );
};

export default UserPage;

