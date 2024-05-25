"use client"; 

import React from 'react'
import { useCart } from '@/app/context/cartContext';
import Header from "../../components/Header"; 
import useProductById from '@/app/hooks/useProductById';
import { formattedCurrency } from '@/app/lib/currencyFormat';

  function ProductPage({params}) {
    const productId = params.id; 
    const { product, loading, error } = useProductById(productId); 
    const {addItem} = useCart(); 

if(loading){
    return(
        <p>Loading...</p>
    )
}

  return (
    <>
    <Header/>
    <div className='grid grid-cols-2 h-[90vh]'>
        <div className='product-img-ctn bg-gray-200'>
        <img src={product.imagePath} alt={product.name} className='w-full object-cover object-center'/>
        </div>
        <div className='product-description-ctn flex items-center justify-center flex-col gap-2'>
            <p>{product.name}</p>
            <p>${formattedCurrency(product.priceInCents)}</p>
            <button className='bg-black py-3 px-4 text-white' onClick={()=>addItem(product)}>Add to cart</button>
        </div>
    </div>
    </>
  )
}

export default ProductPage