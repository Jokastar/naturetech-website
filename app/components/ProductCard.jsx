"use client"; 

import React from 'react'; 
import { useCart } from '../context/cartContext';

function ProductCard({product}) {
  const {addItem} = useCart(); 
  return (
    <div className='card'>
        <img src={product.imagePath} alt={product.name} className='w-full h-[300px]' />
        <p>{product.name}</p>
        <p>{product.description}</p>
        <p>{product.priceInCents}</p>
        <button className='bg-black text-white w-[200px] px-2 py-3' onClick={()=>addItem(product)}>Add to cart</button>
    </div> 
  )
}

export default ProductCard