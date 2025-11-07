// src/app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

// ... (Stripe init and webhookSecret check are unchanged) ...
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

if (!webhookSecret) {
  throw new Error(
    'Missing environment variable: STRIPE_WEBHOOK_SECRET. ' +
    'Get this from your Stripe dashboard: Developers -> Webhooks'
  )
}


async function cancelSanityOrder(subscriptionId: string) {
  const query = `*[_type == "order" && stripeSubscriptionId == $subscriptionId][0]{_id, subscriptionStatus}` // <-- FIX
  const params = { subscriptionId: subscriptionId }
  
  const order = await sanityMutationClient.fetch<any>(query, params)

  if (!order) {
    console.warn(`⚠️ Could not find Sanity order for subscription: ${subscriptionId}. Cannot cancel.`)
    return
  }
  
  if (order.subscriptionStatus === 'cancelled') { // <-- FIX
    console.log(`ℹ️ Order ${order._id} is already cancelled. Skipping.`)
    return
  }

  await sanityMutationClient
    .patch(order._id)
    .set({ subscriptionStatus: 'cancelled' }) // <-- FIX
    .commit()
  
  console.log(`✅ Successfully cancelled Sanity order ${order._id} for subscription ${subscriptionId}.`)
}


export async function POST(request: Request) {
  // ... (body, signature, and event verification are unchanged) ...
  const body = await request.text()
  
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  // Handle `price.created` (unchanged)
  if (event.type === 'price.created') {
    try {
      const price = event.data.object as Stripe.Price
      const productId = price.product as string

      const product = await stripe.products.retrieve(productId)
      const sanitySlug = product.metadata.sanity_slug

      if (!sanitySlug) {
        console.log(`ℹ️ Price ${price.id} created for product ${productId} with no 'sanity_slug' metadata. Skipping sync.`)
        return NextResponse.json({ received: true, message: 'Skipped sync: No sanity_slug.' })
      }

      console.log(`ℹ️ Price ${price.id} created. Looking for Sanity service with slug: ${sanitySlug}...`)
      
      const query = `*[_type == "service" && slug.current == $slug] {_id}`
      const params = { slug: sanitySlug }
      
      const [serviceDoc] = await sanityMutationClient.fetch(query, params)

      if (!serviceDoc) {
        console.warn(`⚠️ Could not find a Sanity service with slug: ${sanitySlug}. Stripe Price ID ${price.id} was not synced.`)
        return NextResponse.json({ received: true, message: 'Warning: Sanity document not found.' })
      }

      const docId = serviceDoc._id
      
      await sanityMutationClient
        .patch(docId)
        .set({ stripePriceId: price.id })
        .commit()

      console.log(`✅ Successfully synced Stripe Price ID ${price.id} to Sanity document ${docId}.`)

    } catch (err: any) {
      console.error(`❌ Error handling 'price.created' event: ${err.message}`)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  // Handle Subscription Cancellations (logic is unchanged, but calls our updated function)
  else if (event.type === 'customer.subscription.updated') {
    try {
      const subscription = event.data.object as Stripe.Subscription
      if (subscription.status === 'canceled' || subscription.cancel_at_period_end) {
        console.log(`ℹ️ Subscription ${subscription.id} was updated to: ${subscription.status}. Cancelling order...`)
        await cancelSanityOrder(subscription.id)
      }
    } catch (err: any) {
      console.error(`❌ Error handling 'customer.subscription.updated': ${err.message}`)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }
  
  else if (event.type === 'customer.subscription.deleted') {
    try {
      const subscription = event.data.object as Stripe.Subscription
      console.log(`ℹ️ Subscription ${subscription.id} was deleted. Cancelling order...`)
      await cancelSanityOrder(subscription.id)
    } catch (err: any) {
      console.error(`❌ Error handling 'customer.subscription.deleted': ${err.message}`)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}