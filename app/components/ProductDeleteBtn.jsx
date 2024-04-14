"use client"; 

import React from 'react'
import { useTransition } from 'react';
import { deleteProducts } from '../admin/products/_actions/products';

import { useRouter } from 'next/navigation';

  function ProductDeleteBtn({value, productId 
  }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); 
  
  const handleClick = (id, handler) =>{
    startTransition(()=>{
      deleteProducts(id)
      router.refresh(); 

    })
  }

    return (
    <li><button onClick={()=>handleClick(productId)} disabled={isPending}  className='hover:bg-red-700 hover:text-white'>{value}</button></li>
  )
}




export default ProductDeleteBtn; 