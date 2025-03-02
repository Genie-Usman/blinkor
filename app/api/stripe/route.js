import Stripe from "stripe";
import { connectDB } from "../../lib/mongodb";
import Order from "../../../models/Order";
import Product from "../../../models/Products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      items,
      customerName,
      customerPhone,
      customerZipCode,
      customerAddress,
      customerEmail,
      customerCity,
      customerDistrict,
      subTotal,
    } = body;
    
    if (!items || Object.keys(items).length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 });
    }

    let sumTotal = 0;
    let formattedItems = [];

    for (const key in items) {
      const item = items[key];

      // Fetching product from database
      const product = await Product.findOne({ title: item.name });

      if (!product) {
        return new Response(
          JSON.stringify({ error: `Product "${item.name}" not found` }),
          { status: 400 }
        );
      }

      // Finding the correct variant
      const variant = product.variants.find(
        (v) => v.size === item.size && v.color === item.color
      );

      if (!variant) {
        return new Response(
          JSON.stringify({ error: `Variant not found for "${item.name}" (${item.size}, ${item.color})` }),
          { status: 400 }
        );
      }

      // Checking stock availability
      if (variant.availableQuantity < item.quantity) {
        return new Response(
          JSON.stringify({ error: `Not enough stock for "${item.name}"` }),
          { status: 400 }
        );
      }

      // Validating price considering discount
      const discountedPrice = parseFloat(
        (product.price * (1 - product.discount / 100)).toFixed(2)
      );

      if (discountedPrice !== parseFloat(item.price)) {
        console.error(
          `Price mismatch for "${item.name}": Expected ${discountedPrice}, Got ${item.price}`
        );
        return new Response(
          JSON.stringify({
            error: "Prices of some products have changed! Please try again!",
          }),
          { status: 400 }
        );
      }

      sumTotal += discountedPrice * item.quantity;

      // Formatting items for Stripe
      formattedItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(discountedPrice * 100),
        },
        quantity: item.quantity,
      });
    }

    // Fixing floating-point precision issues before validation
    sumTotal = parseFloat(sumTotal.toFixed(2));

    if (Math.abs(sumTotal - subTotal) > 0.01) {
      return new Response(
        JSON.stringify({
          error: "Prices of some products have changed! Please try again!",
        }),
        { status: 400 }
      );
    }

    const orderId = Date.now() + Math.floor(Math.random() * 1000);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: formattedItems,
      mode: "payment",
      success_url: `https://blinkor.vercel.app/order?id=${orderId}`,
      cancel_url: `https://blinkor.vercel.app/cancel`,
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
      totalAmount: sumTotal,
      status: "pending",
    });

    await newOrder.save();

    return new Response(JSON.stringify({ id: session.id }), { status: 200 });
  } catch (error) {
    console.error("Error processing order:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
