// src/app/api/capture-payment/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// This secret must be set in your environment variables
// It ensures only Sanity can call this API
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    // 1. Authenticate the request
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${SANITY_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentIntentId, orderId } = await request.json()

    if (!paymentIntentId || !orderId) {
      return NextResponse.json({ error: 'Missing paymentIntentId or orderId' }, { status: 400 })
    }

    // 2. Capture the payment in Stripe
    await stripe.paymentIntents.capture(paymentIntentId)

    // 3. Update the order status in Sanity
    await sanityMutationClient
      .patch(orderId)
      .set({ status: 'paid' })
      .commit()

    return NextResponse.json({ success: true, status: 'paid' })
  } catch (err: any) {
    // Handle "already captured" errors gracefully
    if (err.code === 'payment_intent_unexpected_state') {
      if (err.message.includes('already been captured')) {
        // Already captured, so just update Sanity
        const { orderId } = await request.json()
        await sanityMutationClient.patch(orderId).set({ status: 'paid' }).commit()
        return NextResponse.json({ success: true, status: 'paid', message: 'Already captured' })
      }
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}