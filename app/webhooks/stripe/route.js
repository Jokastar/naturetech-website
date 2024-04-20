import Stripe from "stripe"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

export async function POST(request){
    const event = await stripe.webhooks.constructEvent(
        await request.text(), 
        request.headers.get("stripe-signature"),
        process.env.STRIPE_WEBHOOK_SECRET
    )

    
    if(event.type === "charge.succeeded"){
        console.log(event.charge.object); 
    }

    //create the order here and decrease the product qte 

    //send a recap email to the user 
}