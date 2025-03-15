import Stripe from "stripe";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../../models/Order";
import Product from "../../../../models/Products";

export const runtime = "nodejs"; // Ensure Node.js runtime in Vercel

// Ensure Stripe environment variables are set
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Stripe environment variables are not set.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Required for Stripe raw body
    externalResolver: true, // Prevents Next.js from auto-parsing
  },
};

// Function to read the raw body from the web ReadableStream
async function getRawBody(readableStream) {
  const chunks = [];
  const reader = readableStream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

async function updateOrderStatus(sessionId) {
  await connectDB();
  const order = await Order.findOne({ stripeSessionId: sessionId });

  if (!order) {
    console.warn("⚠️ Order not found for session:", sessionId);
    return null;
  }

  order.status = "paid";
  await order.save();
  return order;
}

async function updateProductStock(order) {
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
          console.warn(
            `⚠️ Not enough stock for ${product.title} - ${variant.size}/${variant.color}`
          );
        }
      }
    }

    if (variantUpdated) {
      await product.save();
    }
  }
}

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
    // ✅ Read the raw body from the web ReadableStream
    const rawBody = await getRawBody(req.body);

    // ✅ Verify Stripe Webhook Signature
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ Stripe Event Received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const order = await updateOrderStatus(session.id);
      if (!order) {
        return new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      await updateProductStock(order);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return new Response(
      JSON.stringify({ error: "Webhook error", details: err.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}