"use client"; 
import React from 'react'
import Link from 'next/link'
import Cart from './Cart'
import { getSession } from '../login/_actions/login'
import { logout } from '../login/_actions/login'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Header() {
  return (
    <header className='flex justify-between font uppercase text-xs text-white fixed  w-full font-test-sohne-mono font-lighter'>
        <nav className='flex justify-between p-8 w-full'>
          <div className="left-header flex gap-[3.5rem]">
            <Link href={"/aboutus"} >about us</Link>
            <Link href={"/shop"} >shop</Link>
          </div>
          <div className='font-test-sohne-breit'>
            <Link href={"/"}>german army trainers</Link>
          </div>
          <div className='right-header flex gap-[3.5rem]'>
            <LoginButton/>
            <Cart/>
          </div>
        </nav>
    </header>
  )
}

function UserDropDown({userName}){
  const router = useRouter();

  const handleLogout = async () =>{
    await logout();
    window.location.href = '/';
  }

  return (
  <div className="dropdown">
  <div tabIndex={0} role="button" className='relative'>
    {userName ? `Hello ${userName}`: "Hello"}
    <div className='h-2 w-2 bg-[var(--green)] rounded-full absolute top-1 right-[-12px]'></div>
    </div>
  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 bg-[var(--light-gray)] text-[var(--black)] text-xs w-52">
  <li><Link href={"/user"}>My profile</Link></li>
    <li className='bg-red-600 text-white'><button onClick={handleLogout}>Logout</button></li>
  </ul>
</div>
  )
}

 function LoginButton(){
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      const response = await getSession();
      if (response?.success) setSession(response.session);
      
    }
    fetchSession();
  }, []);

  return(
    <>
    {session ? <UserDropDown  userName={session.name}/> : <Link href={"/login"}>Login</Link>}
    </>
  )
}

export default Header; 