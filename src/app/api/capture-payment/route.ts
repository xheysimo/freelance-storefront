// src/app/api/capture-payment/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${SANITY_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentIntentId, orderId } = await request.json()

    if (!paymentIntentId || !orderId) {
      return NextResponse.json({ error: 'Missing paymentIntentId or orderId' }, { status: 400 })
    }

    await stripe.paymentIntents.capture(paymentIntentId)

    await sanityMutationClient
      .patch(orderId)
      .set({ oneOffStatus: 'paid' }) // <-- FIX
      .commit()

    return NextResponse.json({ success: true, status: 'paid' })
  } catch (err: any) {
    if (err.code === 'payment_intent_unexpected_state') {
      if (err.message.includes('already been captured')) {
        const { orderId } = await request.json()
        await sanityMutationClient.patch(orderId).set({ oneOffStatus: 'paid' }).commit() // <-- FIX
        return NextResponse.json({ success: true, status: 'paid', message: 'Already captured' })
      }
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}