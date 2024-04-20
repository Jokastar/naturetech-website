"use client";

import React, { useState, useEffect } from 'react'; 
import { useCart } from '../context/cartContext';
import checkout from './_actions/checkout';
import CheckoutForm from '../components/CheckoutForm';

function CheckoutPage() {
  const { items, totalAmount } = useCart();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const secret = await checkout(items, totalAmount);
        setClientSecret(secret);
      } catch (error) {
        console.error("Checkout failed:", error);
      }
    };

    fetchClientSecret();
  }, [items, totalAmount]);

  if (!clientSecret) {
    return <div>Loading...</div>;  // Render loading state while fetching clientSecret
  }

  return (
    <>
    <p>your Orders</p>
    {items.map(item => (
      <div key={item.name}>
        <p>{item.name}</p>
        <p>{item.priceInCents}</p>
      </div>
    ))}
    <p>{totalAmount}</p>
      <CheckoutForm clientSecret={clientSecret}/>
    </>
  );
}

export default CheckoutPage;

