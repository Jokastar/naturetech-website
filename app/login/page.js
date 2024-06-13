"use client"; 
import React, { useEffect, useState } from 'react'
import {login} from "./_actions/login"; 
import {useFormState, useFormStatus} from "react-dom"; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';


function Login({searchParams}) {
    const {redirectTo} = searchParams;
    const [formState, action] = useFormState(login, {});
    const {pending} = useFormStatus();
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter(); 
    
    useEffect(()=>{
      if(formState?.error) setErrorMsg(formState?.error)
      if(formState.success){
        redirectTo ? router.push(redirectTo): router.push("/"); 
    } 
    }, [formState])
    
  return (
    <>
    <div className='flex items-center justify-center p-4 font-test-sohne-breit'>
      <Link href={"/"} className='text-white uppercase text-center text-xs'>German army trainers</Link>
    </div>
    <div className='max-w-[100vw] h-[95vh] flex items-center justify-center font-test-sohne-breit'>
    <form className='w-[536px] border p-6 bg-[var(--light-gray)] text-[var(--dark-gray)] flex flex-col gap-4' action={action}>
      <h2 className='my-2'>Login</h2>
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
  <div>No Account? <Link href={"/signin?redirectTo=" + redirectTo} className='text-[var(--black)] my-2'>Sign up</Link></div>
  <button disabled={pending} className='bg-[var(--green)] text-white w-full p-1 my-2' type='submit' onClick={() => setErrorMsg("")}>
    {pending ? "Sending..." : "Log in"}
  </button>
  {errorMsg && <p className='text-red-600'>{errorMsg}</p>}
</form>
    </div>
    </>
  )
}
export default Login; 