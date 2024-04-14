"use client"; 

import React from 'react'
import { useTransition } from 'react';
import { toggleProductAvailability } from '../admin/products/_actions/products';

import { useRouter } from 'next/navigation';

  function ProductToggleAvailabilityBtn({value, productId, isAvailable 
  }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); 
  
  const handleClick = (id, isAvailable) =>{
    startTransition(()=>{
        toggleProductAvailability(id, isAvailable)
      router.refresh(); 

    })
  }

    return (
    <li><button onClick={()=>handleClick(productId, isAvailable)} disabled={isPending}>{value}</button></li>
  )
}

export default ProductToggleAvailabilityBtn; 