"use server"; 

import Stripe from "stripe";

export default async function checkout(totalAmount, items){

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    const metadata = {};
    if(items){
        items.forEach(item => {
            metadata[product.id] = {
                name: item.name
            };
        });
    }
    
    try{
        const paymentIntent = await stripe.paymentIntents.create(
            {
                amount: 100, 
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