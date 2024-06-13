"use client"; 

import React, { useState } from 'react'; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { updateUserInfos } from '../admin/users/_actions/users';
const appearance = {
  theme: 'stripe',

  variables: {
    colorBackground: '#f3f4f6',
    colorText: '#9ca3af',
    colorDanger: '#df1b41',
    borderRadius: '0px',
    colorBackground:"#f3f4f6",
    fontSizeBase:"12px", 
    spaceingUnit: "8px"
  }, 
};

// Load the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm({ clientSecret, isUserFormValid, totalAmount, userFormInfos, userId, onUserFormSubmit }) {
  return (
    <Elements stripe={stripePromise} options={{clientSecret, appearance }}>
      <Form isUserFormValid={isUserFormValid} totalAmount={totalAmount} userFormInfos={userFormInfos} userId={userId} onUserFormSubmit={onUserFormSubmit}/>
    </Elements>
  );
}

function Form({isUserFormValid, totalAmount, userFormInfos, userId,  onUserFormSubmit}) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const elements = useElements();
  const stripe = useStripe();

  const handleSubmit =  async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const isValid = await isUserFormValid(); 
    if(!isValid) return; 
    onUserFormSubmit(async (data) =>{
     let result = await updateUserInfos(userId, data)

    if(result.error) {
      setError(result.error)
      setIsLoading(false);
      return; 
    } 

    let { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/success-page`,
      },
    });

    if (error) {
      console.log(error);
      setError(error.message || "An unknown error occurred");
    }
    setIsLoading(false);
    })();
        
  };

  return (
    <>
      <p>{error}</p>
      <form onSubmit={handleSubmit}>
        <div className='border  bg-[var(--light-gray)] p-4 text-[var(--black)] text-[12px]'>
          <PaymentElement />
        </div>
        <button
          type="submit"
          className="text-white p-4 w-full my-6  text-sm font-test-sohne-breit bg-[var(--green)]"
          disabled={!stripe || !elements || isLoading}
        >
          {isLoading ? "Processing..." : `Pay ${totalAmount}`}
        </button>
      </form>
      {error && <p className='bg-red-500 text-white p-1 my-4'>{error}</p>}
    </>
  );
}

export default CheckoutForm;
