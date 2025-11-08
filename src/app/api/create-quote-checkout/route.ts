// src/app/api/create-quote-checkout/route.ts

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
const webhookSecret = process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET

export async function POST(request: Request) {
  // 1. Authenticate the request
  const authorization = request.headers.get('Authorization')
  if (authorization !== `Bearer ${webhookSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { quoteId, customerName, customerEmail, estimatedPrice } =
      await request.json()

    const cleanQuoteId = quoteId.startsWith('drafts.') ? quoteId.substring(7) : quoteId;
    
    const productName = `Custom Quote for ${customerName}`;

    // 2. Validate input
    if (!quoteId || !customerName || !customerEmail || !estimatedPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 3. Find or Create Stripe Customer
    let stripeCustomerId: string
    const customerList = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    })

    if (customerList.data.length > 0) {
      stripeCustomerId = customerList.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
      })
      stripeCustomerId = customer.id
    }

    // 4. Create a one-time Stripe Checkout Session
    // We use `price_data` to create a product and price on the fly.
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // Use 'payment' for one-off charges
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'gbp', // As per your quoteType schema
            product_data: {
              name: productName,
              description: `Payment for quote: ${cleanQuoteId}`,
            },
            // Stripe expects the price in the smallest currency unit (e.g., pence)
            unit_amount: Math.round(estimatedPrice * 100),
          },
          quantity: 1,
        },
      ],
      // Add metadata to link this payment back to the quote
      metadata: {
        quoteId: quoteId,
      },
      // Redirect URLs
      success_url: `${siteUrl}/book/success?quote_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/studio/desk/quote;${quoteId}`, // Link back to the quote in Sanity
    })

    const checkoutUrl = stripeSession.url
    if (!checkoutUrl) {
      throw new Error('Could not create Stripe session URL')
    }

    // 5. Patch the Sanity document with the new link and status
    await sanityMutationClient
      .patch(quoteId)
      .set({
        checkoutLink: checkoutUrl,
        status: 'estimated', // Set status to 'Estimated (Link Sent)'
      })
      .commit()

    return NextResponse.json({ url: checkoutUrl })
  } catch (err: any) {
    console.error('Error creating quote checkout session:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}