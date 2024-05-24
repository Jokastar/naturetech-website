import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import dbConnect from "../../../lib/db";
import User from "../../../schemas/mongoSchema/User";
import Product from "../../../schemas/mongoSchema/Product";
import Order from "../../../schemas/mongoSchema/Order";
import { decreaseProductQuantity } from '@/app/admin/products/_actions/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  await dbConnect();

  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'charge.succeeded') {
      const charge = event.data.object;
      const totalAmount = charge.amount;
      const metadata = charge.metadata;
      const userId = metadata.userId;
      delete metadata["userId"];
      
      const user = await User.findOne({ _id: userId });

      if (!user) {
        throw new Error('User not found');
      }

      // Decrease the product quantity in the inventory
      const products = [];
      for (const productId in metadata) {
        if (metadata.hasOwnProperty(productId)) {
          const product = await Product.findById(productId);
          if (!product) {
            throw new Error(`Product not found: ${productId}`);
          }

          const selectedQuantity = parseInt(metadata[productId]);
          const decreaseResult = await decreaseProductQuantity(productId, selectedQuantity);
          if (!decreaseResult.success) {
            throw new Error(`Failed to decrease quantity: ${decreaseResult.message}`);
          }
          products.push({ productId: product._id, quantity: selectedQuantity });
        }
      }

      const order = new Order({
        pricePaidInCents: totalAmount,
        userId: user._id,
        products
      });
      const savedOrder = await order.save();
      
      if (!savedOrder) throw new Error("Order not created");

      user.orders.push(savedOrder);
      await user.save();

      console.log('Order created:', order);
      return NextResponse.json({ received: true });
    }

    if (event.type === 'charge.failed') {
      const charge = event.data.object;
      const userId = charge.metadata.userId;
      // Handle failed charge (e.g., log the failure, notify the user, etc.)
      console.log(`Charge failed for user ${userId}`);
      
      return NextResponse.json({ received: true });
    }

  } catch (err) {
    console.error('Webhook error:', err.message);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  return new NextResponse('Unhandled event type', { status: 400 });
}
