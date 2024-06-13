"use client"; 

import React from 'react'
import { useEffect} from 'react';
import { signIn } from '../login/_actions/login'; 
import {useFormState, useFormStatus} from "react-dom"; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SignIn({searchParams}) {
    const {redirectTo}=searchParams; 
    const [formState, action] = useFormState(signIn, {});
    const {pending} = useFormStatus();
    const router = useRouter(); 
    
    useEffect(()=>{
        console.log(formState)
        if(formState.success){
             redirectTo ? router.push(redirectTo) : router.push("/"); 
        } 
    }, [formState])

  return (
    <>
    <div className='flex items-center justify-center p-4 font-test-sohne-breit'>
      <Link href={"/"} className='text-white uppercase text-center text-xs'>German army trainers</Link>
    </div>
    <div className='max-w-[100vw] h-[95vh] flex items-center justify-center font-test-sohne-breit'>
      <form className='w-[536px] p-6 bg-[var(--light-gray)] text-[var(--dark-gray)] flex flex-col gap-4' action={action}>
      <h2 className='my-2 uppercase'>Sign In</h2>
  
  <div className='my-2'>
    <input
      className='w-full border-b-2 border-[var(--dark-gray)] p-1 bg-transparent focus:bg-[var(--light-gray)] focus:border-[var(--green)]'
      name='firstname'
      id='firstname'
      placeholder='Name'
      required
    />
    {formState && <div className='text-red-600'>{formState["firstname"]}</div>}
  </div>
  
  <div className='my-2'>
    <input
      className='w-full border-b-2 border-[var(--dark-gray)] p-1 bg-transparent focus:bg-[var(--light-gray)] focus:border-[var(--green)]'
      name='email'
      id='email'
      placeholder='Email'
      required
    />
    {formState && <div className='text-red-600'>{formState["email"]}</div>}
  </div>
  
  <div className='my-2'>
    <input
      className='w-full border-b-2 border-[var(--dark-gray)] p-1 bg-transparent focus:bg-[var(--light-gray)] focus:border-[var(--green)]'
      name='password'
      type='password'
      id='password'
      placeholder='Password'
      required
    />
    {formState && <div className='text-red-600'>{formState["password"]}</div>}
  </div>
  
  <button disabled={pending} className='bg-[var(--green)] text-white w-full rounded-md p-1 my-2' type='submit'>
    {pending ? "Sending..." : "Sign in"}
  </button>
  
  {!formState?.success && formState?.error && <p className='text-red-600 text-sm'>{formState.error}</p>}
</form>


    </div>
    </>
  )
}
export default SignIn