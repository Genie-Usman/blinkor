import Stripe from "stripe";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../../models/Order";
import Product from "../../../../models/Products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");

  let rawBody;
  try {
    // Read raw body as a buffer (required for Stripe signature verification)
    const chunks = [];
    for await (const chunk of req.body) {
      chunks.push(chunk);
    }
    rawBody = Buffer.concat(chunks).toString("utf-8");

    // Verify Stripe event
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      await connectDB();
      const order = await Order.findOne({ stripeSessionId: session.id });

      if (order) {
        order.status = "paid";
        await order.save();

        for (const item of order.items) {
          const product = await Product.findOne({ title: item.name });

          if (product) {
            let variantUpdated = false;
            for (const variant of product.variants) {
              if (variant.size === item.size && variant.color === item.color) {
                if (variant.availableQuantity >= item.quantity) {
                  variant.availableQuantity -= item.quantity;
                  variant.totalSold += item.quantity;
                  variantUpdated = true;
                } else {
                  console.warn(
                    `Not enough stock for ${product.title} - ${variant.size}/${variant.color}`
                  );
                }
              }
            }

            if (variantUpdated) {
              await product.save();
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Webhook error" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
