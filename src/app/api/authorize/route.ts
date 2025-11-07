// src/app/api/authorize/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { amount, email } = await request.json()

    // 1. Find or create a Stripe Customer
    let customer = await stripe.customers.list({ email: email, limit: 1 }).then(list => list.data[0]);
    if (!customer) {
      customer = await stripe.customers.create({ email: email });
    }

    // 2. Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      capture_method: 'manual',
      customer: customer.id, // <-- Link to the customer
    })

    // 3. Return the client_secret AND the id
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id // <-- We need this
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}