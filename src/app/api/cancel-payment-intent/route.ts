// src/app/api/cancel-payment-intent/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Get this from your environment variables
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    // 1. Authenticate the request
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${SANITY_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get the IDs from the request body
    const { paymentIntentId, orderId } = await request.json()

    if (!paymentIntentId || !orderId) {
      return NextResponse.json(
        { error: 'Missing paymentIntentId or orderId' },
        { status: 400 }
      )
    }

    // 3. Tell Stripe to cancel the Payment Intent
    await stripe.paymentIntents.cancel(paymentIntentId)

    // 4. Update the Sanity document status to 'cancelled'
    await sanityMutationClient
      .patch(orderId)
      .set({ oneOffStatus: 'cancelled' }) // Set the correct status
      .commit()

    return NextResponse.json({ success: true, status: 'cancelled' })
  } catch (err: any) {
    // 5. Handle errors, including if it's already cancelled
    if (
      err.code === 'payment_intent_unexpected_state' &&
      err.message.includes('already been canceled')
    ) {
      // The Payment Intent is already cancelled in Stripe.
      // Let's just ensure Sanity is in sync.
      const { orderId } = await request.json()
      await sanityMutationClient
        .patch(orderId)
        .set({ oneOffStatus: 'cancelled' })
        .commit()
      return NextResponse.json({
        success: true,
        status: 'cancelled',
        message: 'Already cancelled in Stripe, synced Sanity.',
      })
    }

    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}