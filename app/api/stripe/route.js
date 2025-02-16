import Stripe from 'stripe';
import { connectDB } from '../../lib/mongodb';
import Order from '../../../models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connectDB();

    const { items, customerName, customerPhone, customerZipCode, customerAddress, customerEmail, customerCity, customerDistrict } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = Date.now() + Math.floor(Math.random() * 1000);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_HOST}/order?id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST}/cancel`,
    });

    const newOrder = new Order({
      stripeSessionId: session.id,
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      customerZipCode,
      customerAddress,
      customerCity,
      customerDistrict,
      items,
      totalAmount,
      status: 'pending',
    });

    await newOrder.save();

    return Response.json({ id: session.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
