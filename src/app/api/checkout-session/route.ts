// src/app/api/checkout-session/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialise Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Make sure to set this in your .env.local file
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL! 

export async function POST(request: Request) {
  try {
    // 1. GET BOTH priceId AND serviceSlug
    const { priceId, serviceSlug } = await request.json()

    if (!priceId || !serviceSlug) {
      return NextResponse.json({ error: 'priceId and serviceSlug are required' }, { status: 400 })
    }

    // Create a Stripe Checkout Session for a subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // 2. ADD THE SLUG TO THE SUCCESS URL
      success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}&slug=${serviceSlug}`,
      cancel_url: `${siteUrl}/`,
    })

    // Return the session URL to the frontend
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}