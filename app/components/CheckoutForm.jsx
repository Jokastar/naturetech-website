"use client"; 

import React, {useState} from 'react'; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCart } from '../context/cartContext';


//what is this ??
const stripe =  loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_KEY
  );

function CheckoutForm({clientSecret}) {
  
  return (
    <Elements options={{clientSecret}} stripe={stripe}>
        <Form/>
    </Elements>
  )
}

function Form(){
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);  

  const elements = useElements();
  const stripe = useStripe();

  const { items } = useCart(); 
  const handleSubmit = (e) =>{
    e.preventDefault();
    setIsLoading(true) 
    stripe.confirmPayment({
      elements, 
      confirmParams:{
        return_url:`${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/success-page`
      }
    }).then((error)=>{
      if(error.type === "card_error" || error.type === "validation_error"){
        setError(error.message)
      }else{
        setError("an unknwon error occured")
      }
    }).finally(()=> setIsLoading(false))

  }  
    return (
      <>
      <p>{error}</p>
      <form onSubmit={handleSubmit}>
      <PaymentElement/>
      <button 
      type='submit' 
      className='bg-black text-white px-1 py-2 w-full'
      disabled = {stripe === null || elements === null || isLoading}
      >{isLoading?"Processing...":"Pay"}</button>
      </form> 
      </>
    )
}

export default CheckoutForm; 