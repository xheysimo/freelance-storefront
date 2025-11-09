// src/app/api/sync-sanity-to-stripe/route.ts
import { NextResponse, NextRequest } from 'next/server'
import Stripe from 'stripe'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import { parseBody } from 'next-sanity/webhook'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const sanityWebhookSecret = process.env.SANITY_WEBHOOK_SECRET!
if (!sanityWebhookSecret) {
  throw new Error(
    'Missing environment variable: SANITY_WEBHOOK_SECRET. ' +
    'Get this from your Sanity project settings: API -> Webhooks'
  )
}

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
export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<ServiceDocument>(
      request,
      sanityWebhookSecret,
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      )
    }

    if (body?._type !== 'service' || !body?._id) {
      return NextResponse.json({ 
        received: true, 
        message: 'Not a service document, skipping.' 
      })
    }
    
    const doc = body;

    if (doc.serviceType !== 'recurring') {
      return NextResponse.json({ 
        received: true, 
        message: 'Not a recurring service, skipping.' 
      })
    }

    if (!doc.slug?.current || doc.priceGBP === undefined) {
      return NextResponse.json({ 
        received: true, 
        message: 'Service is missing slug or price, skipping.' 
      })
    }

    let productId = doc.stripeProductId
    const productName = doc.title
    const productMetadata = { sanity_slug: doc.slug.current }

    if (!productId) {
      const product = await stripe.products.create({
        name: productName,
        metadata: productMetadata,
      })
      productId = product.id
      console.log(`✅ Created Stripe Product: ${productId}`)
      
      await sanityMutationClient
        .patch(doc._id)
        .set({ stripeProductId: productId })
        .commit()
    } else {
      await stripe.products.update(productId, {
        name: productName,
        metadata: productMetadata,
      })
      console.log(`ℹ️ Updated Stripe Product: ${productId}`)
    }

    const newPriceInPence = Math.round(doc.priceGBP * 100)
    let currentPriceInPence: number | null = null

    if (doc.stripePriceId) {
      try {
        const currentPrice = await stripe.prices.retrieve(doc.stripePriceId)
        if (currentPrice.product === productId) {
          currentPriceInPence = currentPrice.unit_amount
        }
      } catch (err) {
        console.warn(`Could not retrieve price ${doc.stripePriceId}, will create a new one.`)
      }
    }
    
    if (newPriceInPence !== currentPriceInPence) {
      const newPrice = await stripe.prices.create({
        product: productId,
        unit_amount: newPriceInPence,
        currency: 'gbp',
        recurring: { interval: 'month' },
      })
      
      console.log(`✅ Created new Stripe Price: ${newPrice.id}`)
    } else {
      console.log(`ℹ️ Price is already in sync (${currentPriceInPence}p).`)
    }

    return NextResponse.json({ received: true, productId: productId })

  } catch (err: any) {
    console.error(`❌ Error in /api/sync-sanity-to-stripe: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}