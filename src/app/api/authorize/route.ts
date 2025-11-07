// src/app/api/authorize/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { amount, email, name } = await request.json() // Get all 3 fields

    if (!amount || !email || !name) {
      return NextResponse.json({ error: 'Missing amount, email, or name' }, { status: 400 })
    }

    // 1. Find a Stripe Customer
    let customer = await stripe.customers.list({ email: email, limit: 1 }).then(list => list.data[0]);

    // --- THIS IS THE FIX ---
    if (customer) {
      // 2. If customer exists, UPDATE their name
      customer = await stripe.customers.update(customer.id, {
        name: name,
        // You can update other details here if needed
      });
    } else {
      // 3. If customer does NOT exist, CREATE them with email and name
      customer = await stripe.customers.create({ 
        email: email, 
        name: name 
      });
    }
    // --- END OF FIX ---

    // 4. Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      capture_method: 'manual',
      customer: customer.id, // <-- Link to the customer
    })

    // 5. Return the client_secret AND the id
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id // <-- We need this
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}