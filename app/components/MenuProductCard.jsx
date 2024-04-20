import React, { useState } from 'react';
import { useCart } from '../context/cartContext';
import Image from 'next/image';

    const MenuProductCard = ({ product }) => {
      const {increaseQuantity,removeItem, decreaseQuantity} = useCart(); 
    
      // Function to increase quantity + should not be greater that product qte
     
  return (
    <div className="item">
      <Image src={product.imagePath} alt={product.name} width={60} height={60}/>
      <h2 className="product-title">{product.name}</h2>
      <p className="product-price">Price: ${product.priceInCents}</p>
      <div className="product-quantity">
        <label htmlFor="quantity">Quantity:</label>
        <div className='quantity-btn flex items-center'>
        <QuantityBtn sign={"+"} onClick = {increaseQuantity} productId={product._id}/>
        <p className='w-[24px] h-[24px] flex items-center justify-center'>{product.quantity}</p>
        <QuantityBtn sign={"-"} onClick={decreaseQuantity} productId={product._id}/>
      </div>
        </div>
      <button onClick={()=>removeItem(product._id)}>Remove item</button>
    </div>
  );
}

function QuantityBtn({sign, onClick, productId}){
  return (
    <div 
    className='w-[24px] h-[24px] flex items-center justify-center bg-black text-white'
    onClick={()=>onClick(productId)}
    >
    <p>{sign}</p>
    </div>
  )
}


export default MenuProductCard; 