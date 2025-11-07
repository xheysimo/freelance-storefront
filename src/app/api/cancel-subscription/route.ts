// src/app/api/cancel-subscription/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// This secret must be set in your environment variables
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    // 1. Authenticate the request from Sanity
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${SANITY_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 })
    }

    // 2. Tell Stripe to cancel the subscription
    // This will automatically fire the 'customer.subscription.deleted' webhook
    // which our stripe-webhook endpoint will catch, and update Sanity.
    await stripe.subscriptions.cancel(subscriptionId)

    // Note: We don't update Sanity here. We let the webhook handle it
    // to keep a single source of truth.

    return NextResponse.json({ success: true, message: 'Subscription cancelled in Stripe.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}