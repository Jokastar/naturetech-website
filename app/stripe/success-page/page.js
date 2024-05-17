import React from 'react';
import Stripe from 'stripe';

// Assuming you have a connection function for mongoose
import dbConnect from '../../lib/db';
import Product from '../../schemas/mongoSchema/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function SuccessPage({ searchParams }) {
  await dbConnect();

  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent);

  if (paymentIntent.status === 'succeeded') {
    const metadata = paymentIntent.metadata;
    const productIds = Object.keys(metadata);
    const products = await Product.find({ _id: { $in: productIds } });

    return (
      <div>
        <h1>Thank you for your purchase!</h1>
        <h2>Order Details</h2>
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <img src={product.imagePath} alt={product.name} width="100" />
              <p>{product.name}</p>
              <p>Quantity: {metadata[product._id]}</p>
              <p>Price: ${(product.priceInCents / 100)}</p>
            </div>
          ))}
        </div>
        <h3>Total Amount: ${(paymentIntent.amount / 100).toFixed(2)}</h3>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Payment Failed</h1>
        <p>{paymentIntent.last_payment_error ? paymentIntent.last_payment_error.message : 'Payment failed'}</p>
      </div>
    );
  }
}

export default SuccessPage;
