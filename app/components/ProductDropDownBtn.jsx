"use client"; 

import React, { startTransition } from 'react'
import { useTransition } from 'react';
import { deleteProducts } from '../admin/products/_actions/products'; 
import { useRouter } from 'next/navigation';

  function ProductDropDownBtn({value, productId}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); 

  const handleClick = (id) =>{
    startTransition(()=>{
      deleteProducts(id)
      router.refresh(); 

    })
  }

    return (
    <li><button onClick={()=>handleClick(productId)} disabled={isPending}  className='text-white bg-red-400  hover:bg-red-700'>{value}</button></li>
  )
}




export default ProductDropDownBtn; 