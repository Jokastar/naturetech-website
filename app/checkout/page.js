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
      <CheckoutForm clientSecret={clientSecret} />
    </>
  );
}

export default CheckoutPage;

