"use client"; 

import React, { useState } from 'react'; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';



const appearance = {
  theme: 'stripe',

  variables: {
    colorBackground: '#f3f4f6',
    colorText: '#9ca3af',
    colorDanger: '#df1b41',
    borderRadius: '0px',
    border:"2px solid #9ca3af",
  }, 
  rules:{
    ".Input":{
      width:"100%"
    }
  }
};

// Load the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm({ clientSecret, isUserFormValid }) {
  return (
    <Elements stripe={stripePromise} options={{clientSecret, appearance }}>
      <Form isUserFormValid={isUserFormValid}/>
    </Elements>
  );
}

function Form({isUserFormValid}) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const elements = useElements();
  const stripe = useStripe();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await isUserFormValid(); 
    if(!isValid) return; 
    /* setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/success-page`,
      },
    });

    if (error) {
      console.log(error);
      setError(error.message || "An unknown error occurred");
    }

    setIsLoading(false); */
    
  };

  return (
    <>
      <p>{error}</p>
      <form onSubmit={handleSubmit} className="bg-gray-100 border text-gray-400 p-4">
        <PaymentElement />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 w-full mt-4"
          disabled={!stripe || !elements || isLoading}
        >
          {isLoading ? "Processing..." : "Pay"}
        </button>
      </form>
    </>
  );
}

export default CheckoutForm;
