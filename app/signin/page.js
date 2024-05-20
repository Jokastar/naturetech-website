"use client"; 

import React from 'react'
import { useEffect } from 'react';
import { signIn } from '../login/_actions/login'; 
import {useFormState, useFormStatus} from "react-dom"; 
import { useRouter } from 'next/router';

function SignIn({searchParams}) {
    const {redirectTo}=searchParams; 
    const [formState, action] = useFormState(signIn, {});
    const {pending} = useFormStatus();
    const router = useRouter(); 
    
    useEffect(()=>{
        if(formState.success){
            redirectTo ? router.push(redirectTo) : router.push("/"); 
        } 
    }, [formState])

  return (
    <div className='w-[90vw] h-[90vh] flex items-center justify-center'>
    <form className='w-[400px] border border-slate-900 rounded-md p-3' action={action}>
        <h2 className='my-2 text-center'>Sign In</h2>
        <div className='flex flex-
        col gap-2 my-2'>
            <label htmlFor='name'>Name</label>
            <input 
            className='border border-slate-900 rounded-md p-1' 
            name='name' 
            id='name'
            required/>
            {formState && <div className='text-red-600'>{formState["name"]}</div>}
        </div>
        <div className='flex flex-col gap-2 my-2'>
            <label htmlFor='email'>Email</label>
            <input 
            className='border border-slate-900 rounded-md p-1' 
            name='email' 
            id='email'
            required/>
            {formState && <div className='text-red-600'>{formState["email"]}</div>}
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
            {formState && <div className='text-red-600'>{formState["password"]}</div>}
        </div>
        <button disabled={pending} className='bg-black text-white w-full rounded-md p-1 my-2' type='submit'>{pending ? "Sending...": "Sign in"}</button>
        <p className='text-red-600'>{!formState.success && formState.message}</p>
    </form>
    </div>
  )
}
export default SignIn