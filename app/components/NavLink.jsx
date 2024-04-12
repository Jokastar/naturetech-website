"use client"; 

import React from 'react'
import Link from 'next/link'
import capitalizeFirstLetter from '../lib/capitalizeFirstLetter'; 
import { usePathname } from 'next/navigation';

function NavLink({pathname}) {
const path = usePathname(); 
  return (
   <li><Link href={"/admin/"+pathname}>{capitalizeFirstLetter(pathname)}</Link></li>
  )
}

export default NavLink