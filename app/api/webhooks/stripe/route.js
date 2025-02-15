import Stripe from "stripe";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../../models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return Response.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      await connectDB();

      const order = await Order.findOne({ stripeSessionId: session.id });

      if (order) {
        order.status = "paid";
        await order.save();
      }
    } catch (err) {
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  return Response.json({ received: true });
}
