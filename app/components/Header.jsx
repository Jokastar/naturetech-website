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
    <header className='flex  justify-between'>
        <Link href="/">Home</Link>
        <nav className='flex gap-[5rem] min-w[400px] justify-center'>
            <Link href={"/shop"}>Shop</Link>
            <Link href={"/collection"}>Collection</Link>
            <Link href={"/aboutus"}>About Us</Link>
        </nav>
        <div>
        <LoginButton/>
        <Cart/>
        </div>
    </header>
  )
}

function LogoutDropDown(){
  const router = useRouter(); 
  const handleLogout = async () =>{
    await logout();
    window.location.href = '/';
  }

  return (
    <div className="dropdown">
  <div tabIndex={0} role="button" className="btn m-1">Hello User</div>
  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
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
      console.log("response ", response); 
      if (response?.success) setSession(response.session);
    }
    fetchSession();
  }, [session]);

  return(
    <>
    {session ? <LogoutDropDown/> : <Link href={"/login"} className='font-semibold'>Login</Link>}
    </>
  )
}

export default Header; 