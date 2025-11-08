// src/app/api/create-order/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { paymentIntentId, serviceId } = await request.json()

    if (!paymentIntentId || !serviceId) {
      return NextResponse.json({ error: 'Missing paymentIntentId or serviceId' }, { status: 400 })
    }

    // 1. Get customer details from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    const customer = await stripe.customers.retrieve(paymentIntent.customer as string) as Stripe.Customer

    const doc = {
      _type: 'order',
      service: {
        _type: 'reference',
        _ref: serviceId,
      },
      stripePaymentIntentId: paymentIntentId,
      oneOffStatus: 'new',
      customerName: customer.name || 'N/A',
      customerEmail: customer.email || 'N/A',
      stripeCustomerId: customer.id, // <-- 2. ADD THE CUSTOMER ID
    }

    const newDoc = await sanityMutationClient.create(doc)

    return NextResponse.json({ orderId: newDoc._id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}