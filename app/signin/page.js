"use client"; 

import React from 'react'
import { signIn } from '../login/_actions/login'; 
import {useFormState, useFormStatus} from "react-dom"; 

function SignIn() {
    const [errors, action] = useFormState(signIn, {});
    const {pending} = useFormStatus(); 

  return (
    <form className='w-[400px] border border-slate-900 rounded-md p-3' action={action}>
        <h2 className='my-2'>Sign In</h2>
        <div className='flex flex-col gap-2 my-2'>
            <label htmlFor='name'>Name</label>
            <input 
            className='border border-slate-900 rounded-md p-1' 
            name='name' 
            id='name'
            required/>
            {errors && <div className='text-red-600'>{errors["name"]}</div>}
        </div>
        <div className='flex flex-col gap-2 my-2'>
            <label htmlFor='email'>Email</label>
            <input 
            className='border border-slate-900 rounded-md p-1' 
            name='email' 
            id='email'
            required/>
            {errors && <div className='text-red-600'>{errors["email"]}</div>}
        </div>
        <div className='flex flex-col gap-2 my-2'>
            <label htmlFor='password'>Password</label>
            <input 
            className='border border-slate-900 rounded-md p-1' 
            name='password' 
            type='password' 
            id='password'
            required
            />
            {errors && <div className='text-red-600'>{errors["password"]}</div>}
        </div>
        <button disabled={pending} className='bg-black text-white w-full rounded-md p-1 my-2' type='submit'>{pending ? "Sending...": "Sign in"}</button>
        <p className='text-red-600'>{typeof errors === "string" && errors}</p>
    </form>
  )
}
export default SignIn