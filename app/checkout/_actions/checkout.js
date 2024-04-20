"use server"; 

import Stripe from "stripe";

export default async function checkout(items, totalAmount){

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const metadata = {};
    if (items) {
        // Convert items object to array
        const itemsArray = Object.values(items);
      
        itemsArray.forEach(item => {
          // Convert item._id to string
          const productId = String(item._id);  
          // Ensure name is a string
          const productName = String(item.name);
      
          metadata[productId] = productName
        });
        console.log(metadata); 
      }
      
    
    try{
        const paymentIntent = await stripe.paymentIntents.create(
            {
                amount: totalAmount / 100, 
                currency:"EUR", 
                metadata: metadata
            }
        )
        if(paymentIntent.client_secret == null){
            throw Error("Stripe failed to create payment intent"); 
        }
        
        return paymentIntent.client_secret
        
    }catch(e){
        console.log(e); 
    }
   
}