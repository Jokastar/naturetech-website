import React from 'react';
import Stripe from 'stripe';
import {getListOfProducts} from "../../admin/products/_actions/products"
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function SuccessPage({ searchParams }) {

  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent);

  if (paymentIntent.status === 'succeeded') {
    const metadata = paymentIntent.metadata;
    const productIds = Object.keys(metadata);
    const filteredProductIds = productIds.filter(id => id !== "userId"); 
   
    const {products} = await getListOfProducts(filteredProductIds)
    return (
      <div>
        <h1>Thank you for your purchase!</h1>
        <h2>Order Details</h2>
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <img src={product.imagePath} alt={product.name} width="100"/>
              <p>{product.name}</p>
              <p>Quantity: {metadata[product._id]}</p>
              <p>Price: ${product.priceInCents/ 100}</p>
            </div>
          ))}
        </div>
        <h3>Total Amount: ${(paymentIntent.amount).toFixed(2)}</h3>
        <button className='text-white bg-black p-2' onClick={()=> redirect("/")}>Home</button>
      </div>
    );
  } 
  
  return (
      <div>
        <h1>Payment Failed</h1>
        <p>{paymentIntent.last_payment_error ? paymentIntent.last_payment_error.message : 'Payment failed'}</p>
      </div>
    );
  
}

export default SuccessPage;

