// src/app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Get the webhook secret from environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

if (!webhookSecret) {
  throw new Error(
    'Missing environment variable: STRIPE_WEBHOOK_SECRET. ' +
    'Get this from your Stripe dashboard: Developers -> Webhooks'
  )
}

/**
 * This is the webhook handler for Stripe events.
 * It listens for `price.created` events to sync the new price ID with Sanity.
 */
export async function POST(request: Request) {
  const body = await request.text()
  
  // --- THIS IS THE FIX ---
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!
  // --- END OF FIX ---

  let event: Stripe.Event

  // 1. Verify the webhook signature
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  // 2. Handle the `price.created` event
  if (event.type === 'price.created') {
    try {
      const price = event.data.object as Stripe.Price
      const productId = price.product as string

      // 3. Retrieve the full Product object to read its metadata
      const product = await stripe.products.retrieve(productId)
      const sanitySlug = product.metadata.sanity_slug

      if (!sanitySlug) {
        // Not an error, just info. This product isn't meant to be synced.
        console.log(`ℹ️ Price ${price.id} created for product ${productId} with no 'sanity_slug' metadata. Skipping sync.`)
        return NextResponse.json({ received: true, message: 'Skipped sync: No sanity_slug.' })
      }

      // 4. Find the corresponding service document in Sanity by its slug
      console.log(`ℹ️ Price ${price.id} created. Looking for Sanity service with slug: ${sanitySlug}...`)
      
      const query = `*[_type == "service" && slug.current == $slug] {_id}`
      const params = { slug: sanitySlug }
      
      const [serviceDoc] = await sanityMutationClient.fetch(query, params)

      if (!serviceDoc) {
        // This is a warning. The slug in Stripe doesn't match any service.
        console.warn(`⚠️ Could not find a Sanity service with slug: ${sanitySlug}. Stripe Price ID ${price.id} was not synced.`)
        return NextResponse.json({ received: true, message: 'Warning: Sanity document not found.' })
      }

      // 5. Update the Sanity document with the new Stripe Price ID
      const docId = serviceDoc._id
      
      await sanityMutationClient
        .patch(docId)
        .set({ stripePriceId: price.id }) // <-- This is the final step!
        .commit()

      console.log(`✅ Successfully synced Stripe Price ID ${price.id} to Sanity document ${docId}.`)

    } catch (err: any) {
      console.error(`❌ Error handling 'price.created' event: ${err.message}`)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  // Acknowledge other event types with a 200 OK
  return NextResponse.json({ received: true })
}