import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../../models/Order";
import Product from "../../../../models/Products";
import { buffer } from "stream/consumers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Required for raw body handling
    externalResolver: true,
  },
};

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("🚨 Missing Stripe Signature");
    return new Response(JSON.stringify({ error: "Missing stripe-signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Read raw request body as a buffer
    const rawBody = await buffer(req.body);

    // Verify Stripe Webhook Signature
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ Stripe Event Received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      await connectDB();
      const order = await Order.findOne({ stripeSessionId: session.id });

      if (!order) {
        console.warn("⚠️ Order not found for session:", session.id);
        return new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      order.status = "paid";
      await order.save();

      // Update product stock
      for (const item of order.items) {
        const product = await Product.findOne({ title: item.name });

        if (!product) {
          console.warn(`⚠️ Product not found: ${item.name}`);
          continue;
        }

        let variantUpdated = false;
        for (const variant of product.variants) {
          if (variant.size === item.size && variant.color === item.color) {
            if (variant.availableQuantity >= item.quantity) {
              variant.availableQuantity -= item.quantity;
              variant.totalSold += item.quantity;
              variantUpdated = true;
            } else {
              console.warn(`⚠️ Not enough stock for ${product.title} - ${variant.size}/${variant.color}`);
            }
          }
        }

        if (variantUpdated) {
          await product.save();
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return new Response(JSON.stringify({ error: "Webhook error" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}