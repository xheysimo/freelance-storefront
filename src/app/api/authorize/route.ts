// src/app/api/authorize/route.ts
import { NextResponse } from 'next/server'
// Make sure to use the 'stripe' package, not '@stripe/stripe-js'
import Stripe from 'stripe'

// Initialise Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { amount } = await request.json()

    // Create a PaymentIntent with `capture_method: 'manual'`
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      capture_method: 'manual', // This is the key!
    })

    // Return the client_secret to the frontend
    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}