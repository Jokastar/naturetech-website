"use client"; 

import React from 'react'; 
import { useCart } from '../context/cartContext';
import Link from 'next/link';

function ProductCard({product}) {
  const {addItem} = useCart(); 
  return (
    <Link href={`/shop/${product._id}`}>
    <div className='bg-gray-200 p-2'>
        <img src={product.imagePath} alt={product.name} className='w-full h-[350px] object-cover'/>
        <div className='flex justify-between'>
          <p>{product.name}</p>
          <p>{product.priceInCents}$</p>
        </div>
    </div> 
    </Link>
  )
}

export default ProductCard; 