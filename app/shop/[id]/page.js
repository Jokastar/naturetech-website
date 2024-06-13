"use client";

import React, { useState } from 'react';
import { useCart } from '@/app/context/cartContext';
import Header from "../../components/Header";
import useProductById from '@/app/hooks/useProductById';
import { formattedCurrency } from '@/app/lib/currencyFormat';

function ProductPage({ params }) {
  const productId = params.id;
  const { product, loading, error } = useProductById(productId);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");

  const handleSelectSize = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    addItem(product, selectedSize, 1); // Add item with quantity 1 by default
  };

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  if (error || !product) {
    return (
      <p>{error || "No product available"}</p>
    );
  }

  return (
    <>
      <Header />
      <div className='grid grid-cols-2 h-[100vh]'>
        <div className='product-img-ctn bg-[var(--light-gray)] overflow-y-scroll'>
          {product.productImagesUrls.map((imageUrl, index) => (
            <img src={imageUrl} alt={product?.name} key={index} className='w-full object-cover object-center' />
          ))}
        </div>
        <div className='product-description-ctn flex flex-col gap-8 p-8 text-[var(--light-gray)] text-sm font-lighter min-h-full'>
          <div className='white-space h-[10vh]'></div>
          <div className='flex justify-between uppercase font-test-sohne-mono'>
            <p >{product.name}</p>
            <p className='text-md'>{formattedCurrency(product.priceInCents)}</p>
          </div>
          <div className='product-description my-6'>
            <p className="uppercase text-xs">Description</p>
            <p className='my-2'>{product.description}</p>
          </div>
          <div className='product-sizes'>
            <p className="uppercase text-xs">Sizes</p>
            <div className='sizes my-2 flex gap-4'>
              {
                product.sizes.map((size, index) => (
                  <div
                    className={`size w-5 h-5 p-3 rounded-[60%] flex items-center justify-center cursor-pointer transition-background ease-out duration-200 
                    ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-[var(--light-gray)] hover:text-white'}`}
                    key={index}
                    onClick={() => handleSelectSize(size)}
                  >
                    <div className="text-[10px] font-bold">{size}</div>
                  </div>
                ))
              }
            </div>
          </div>
          <button
            className='bg-[var(--green)] py-3 px-4 text-white text-md font-test-sohne-breit uppercase'
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductPage;


