"use client"; 

import React from 'react'; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCart } from '../context/cartContext';


//what is this ??
const stripe =  loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_KEY
  );

function CheckoutForm({clientSecret}) {
  const { items } = useCart(); 
  return (
    <Elements options={{clientSecret}} stripe={stripe}>
        <Form/>
    </Elements>
  )
}

function Form(){
    const stripe = useStripe(); 
    const elements = useElements(); 
    return (
        <PaymentElement/>
    )
}

export default CheckoutForm; 