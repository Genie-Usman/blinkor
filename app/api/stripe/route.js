import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: 'test@example.com',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'inr',  
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_HOST}/order`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST}/cancel`,
    });

    return Response.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error.message); 
    return Response.json({ error: error.message }, { status: 500 });
  }
}
