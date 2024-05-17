import React from 'react';
import Stripe from 'stripe';

import dbConnect from '../../lib/db';
import Product from '../../schemas/mongoSchema/Product';
import Inventory from "../../schemas/mongoSchema/Inventory"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function SuccessPage({ searchParams }) {
  await dbConnect();

  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent);

  if (paymentIntent.status === 'succeeded') {
    const metadata = paymentIntent.metadata;
    const productIds = Object.keys(metadata);
    
    // Fetch products and their corresponding prices from Inventory
    const products = await Product.find({ _id: { $in: productIds } });
    const inventories = await Inventory.find({ productId: { $in: productIds } });

    // Create a map of product prices by productId
    const priceMap = {};
    inventories.forEach(inventory => {
      priceMap[inventory.productId] = inventory.priceInCents;
    });

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
              <p>Price: ${(priceMap[product._id] / 100)}</p>
            </div>
          ))}
        </div>
        <h3>Total Amount: ${(paymentIntent.amount).toFixed(2)}</h3>
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

