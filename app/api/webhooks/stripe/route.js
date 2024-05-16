import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import dbConnect from "../../../lib/db";
import User from "../../../schemas/mongoSchema/User";
import Product from "../../../schemas/mongoSchema/Product";
import Order from "../../../schemas/mongoSchema/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  await dbConnect();

  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'charge.succeeded' || event.type === 'charge.updated') {
      const charge = event.data.object;

      const email = charge.billing_details.email;
      const totalAmount = charge.amount;
      const metadata = charge.metadata;

      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const productIds = [];
      for (const productId in metadata) {
        if (metadata.hasOwnProperty(productId)) {
          const product = await Product.findById(productId);
          if (!product) {
            throw new Error(`Product not found: ${productId}`);
          }
          productIds.push(product._id);

          const selectedQuantity = parseInt(metadata[productId]);
          const decreaseResult = await decreaseProductQuantity(productId, selectedQuantity);
          if (!decreaseResult.success) {
            throw new Error(`Failed to decrease quantity: ${decreaseResult.message}`);
          }
        }
      }

      const order = new Order({
        pricePaidInCents: totalAmount,
        userId: user._id,
        productIds
      });
      await order.save();

      console.log('Order created:', order);
      return NextResponse.json({ received: true });
    }

  } catch (err) {
    console.error('Webhook error:', err.message);
    return new NextResponse('Webhook error', { status: 400 });
  }

  return new NextResponse('Unhandled event type', { status: 400 });
}
