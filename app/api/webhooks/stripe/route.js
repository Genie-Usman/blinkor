// stripe listen --forward-to localhost:3000/api/webhooks/stripe

import Stripe from "stripe";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../../models/Order";
import Product from "../../../../models/Products";

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

        // Reducing stock for each item in the order
        for (const item of order.items) {
          const product = await Product.findOne({ title: item.name });

          if (product) {
            let variantUpdated = false;

            for (const variant of product.variants) {
              if (variant.size === item.size && variant.color === item.color) {
                if (variant.availableQuantity >= item.quantity) {
                  variant.availableQuantity -= item.quantity;
                  variantUpdated = true;
                } else {
                  console.warn(`Not enough stock for ${product.title} - ${variant.size}/${variant.color}`);
                }
              }
            }

            if (variantUpdated) {
              await product.save();
            }
          }
        }
    }
    } catch (err) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

return Response.json({ received: true });
}
