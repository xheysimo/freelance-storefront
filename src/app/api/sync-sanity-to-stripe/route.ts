// src/app/api/sync-sanity-to-stripe/route.ts
import { NextResponse, NextRequest } from 'next/server' // <-- 1. Import NextRequest
import Stripe from 'stripe'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import { parseBody } from 'next-sanity/webhook'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Get Sanity Webhook Secret from environment variables
const sanityWebhookSecret = process.env.SANITY_WEBHOOK_SECRET!
if (!sanityWebhookSecret) {
  throw new Error(
    'Missing environment variable: SANITY_WEBHOOK_SECRET. ' +
    'Get this from your Sanity project settings: API -> Webhooks'
  )
}

// Define the shape of the document we expect from the webhook
interface ServiceDocument {
  _id: string;
  _type: 'service';
  serviceType: 'oneOff' | 'recurring';
  slug: { current: string };
  title: string;
  priceGBP: number;
  stripeProductId?: string;
  stripePriceId?: string;
}

/**
 * This endpoint is triggered by a Sanity webhook on 'service' document changes.
 * It uses `next-sanity/webhook` to securely validate the request.
 * It creates/updates a Stripe Product and creates a new Price if needed.
 * The *existing* /api/stripe-webhook will then sync the new Price ID back.
 */
export async function POST(request: NextRequest) { // <-- 2. Use NextRequest here
  try {
    // 1. Authenticate the webhook request
    const { isValidSignature, body } = await parseBody<ServiceDocument>(
      request, // This now correctly passes a NextRequest
      sanityWebhookSecret,
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      )
    }

    // 2. Check if this is a valid 'service' document
    if (body?._type !== 'service' || !body?._id) {
      return NextResponse.json({ 
        received: true, 
        message: 'Not a service document, skipping.' 
      })
    }
    
    const doc = body; // Use the parsed and validated body

    // 3. We only care about recurring services
    if (doc.serviceType !== 'recurring') {
      return NextResponse.json({ 
        received: true, 
        message: 'Not a recurring service, skipping.' 
      })
    }

    // 4. We need a slug and price to work with
    if (!doc.slug?.current || doc.priceGBP === undefined) {
      return NextResponse.json({ 
        received: true, 
        message: 'Service is missing slug or price, skipping.' 
      })
    }

    let productId = doc.stripeProductId
    const productName = doc.title
    // This metadata link is crucial for the other webhook
    const productMetadata = { sanity_slug: doc.slug.current }

    // 5. Create or Update Stripe Product
    if (!productId) {
      // Create new product
      const product = await stripe.products.create({
        name: productName,
        metadata: productMetadata,
      })
      productId = product.id
      console.log(`✅ Created Stripe Product: ${productId}`)
      
      // Patch Sanity doc with the new Product ID
      await sanityMutationClient
        .patch(doc._id)
        .set({ stripeProductId: productId })
        .commit()
    } else {
      // Update existing product
      await stripe.products.update(productId, {
        name: productName,
        metadata: productMetadata,
      })
      console.log(`ℹ️ Updated Stripe Product: ${productId}`)
    }

    // 6. Check if Price needs to be updated
    const newPriceInPence = Math.round(doc.priceGBP * 100)
    let currentPriceInPence: number | null = null

    if (doc.stripePriceId) {
      try {
        const currentPrice = await stripe.prices.retrieve(doc.stripePriceId)
        // Only compare if the price is for the same product
        if (currentPrice.product === productId) {
          currentPriceInPence = currentPrice.unit_amount
        }
      } catch (err) {
        console.warn(`Could not retrieve price ${doc.stripePriceId}, will create a new one.`)
      }
    }
    
    // 7. Create new Price if it's different or doesn't exist
    if (newPriceInPence !== currentPriceInPence) {
      const newPrice = await stripe.prices.create({
        product: productId,
        unit_amount: newPriceInPence,
        currency: 'gbp',
        recurring: { interval: 'month' }, // Assumed monthly. Adjust if you add this as an option in Sanity.
      })
      
      console.log(`✅ Created new Stripe Price: ${newPrice.id}`)
      // --- LOOP COMPLETE ---
      // The `price.created` event from this action will now be sent
      // from Stripe to your /api/stripe-webhook endpoint,
      // which will then save the new `stripePriceId` to Sanity.
      // We don't need to do anything else here.
    } else {
      console.log(`ℹ️ Price is already in sync (${currentPriceInPence}p).`)
    }

    return NextResponse.json({ received: true, productId: productId })

  } catch (err: any) {
    console.error(`❌ Error in /api/sync-sanity-to-stripe: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}