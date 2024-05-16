import React from 'react'
import Link from 'next/link'
import Cart from './Cart'

function Header() {
  return (
    <header className='flex  justify-between'>
        <Link href="/">Home</Link>
        <nav className='flex gap-[5rem] min-w[400px] justify-center'>
            <Link href={"/shop"}>Shop</Link>
            <Link href={"/collection"}>Collection</Link>
            <Link href={"/aboutus"}>About Us</Link>
        </nav>
        <Cart/>
    </header>
  )
}

export default Header