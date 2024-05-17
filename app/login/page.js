"use client"; 
import React, { useEffect } from 'react'
import {login} from "./_actions/login"; 
import {useFormState, useFormStatus} from "react-dom"; 
import { useRouter } from 'next/navigation';

import Link from 'next/link';


function Login({searchParams}) {
    const {redirectTo} = searchParams;
    const [formState, action] = useFormState(login, {});
    const {pending} = useFormStatus();
    const router = useRouter(); 

    useEffect(()=>{
      console.log(formState)
      if(formState.success){
        router.push("/checkout"); 
    } 
    }, [formState])
    
  return (
    <div className='w-[90vw] h-[90vh] flex items-center justify-center'>
    <form className='w-[400px] border border-slate-900 rounded-md p-3' action={action}>
        <h2 className='my-2 text-center'>Login</h2>
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
        <div>No Account ? <Link href={"/signin/?redirectTo="+redirectTo} className='text-blue-500 font-medium my-2'>Sign up</Link></div>
        <button disabled={pending} className='bg-black text-white w-full rounded-md p-1 my-2' type='submit'>{pending ? "Sending...": "Log in"}</button>
    </form>
    </div>
  )
}

export default Login; 