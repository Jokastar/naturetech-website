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
    console.log("error ", error); 

if(loading){
    return(
        <p>Loading...</p>
    )
}

if(error || !product){
  return(
    <p>{error || "No product available"}</p>
  )
}

  return (
    <>
    <Header/>
    <div className='grid grid-cols-2 h-[100vh]'>
        <div className='product-img-ctn bg-[var(--light-gray)]'>
        <img src={product.imagePath} alt={product?.name} className='w-full object-cover object-center'/>
        </div>
        <div className='product-description-ctn flex flex-col gap-6 p-8 text-[var(--light-gray)] text-sm'>
          <div className='white-space h-[20vh]'></div>
          <div className='flex justify-between'>
            <p className='uppercase'>{product.name}</p>
            <p>{formattedCurrency(product.priceInCents)}</p>
          </div>
          <div className='product-description'>
            <p className='uppercase'>Description</p>

          </div>
          <div className='product-sizes flex gap-2'>
            <p className='uppercase'>Sizes</p>
            <div className='sizes'>
            <div className='size w-5 h-5 p-3 bg-white text-[var(--black)] rounded-[60%] flex items-center justify-center'>
              <div className="text-[10px] font-medium text-black">40</div>
            </div>
            </div>
          </div>
            <button className='bg-[var(--green)] py-3 px-4 text-white text-md' onClick={()=>addItem(product)}>Add to cart</button>
        </div>
    </div>
    </>
  )
}

export default ProductPage