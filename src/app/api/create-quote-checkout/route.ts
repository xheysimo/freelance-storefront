// src/app/api/create-quote-checkout/route.ts

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
const webhookSecret = process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET

export async function POST(request: Request) {
  const authorization = request.headers.get('Authorization')
  if (authorization !== `Bearer ${webhookSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { quoteId, customerName, customerEmail, estimatedPrice } =
      await request.json()

    const cleanQuoteId = quoteId.startsWith('drafts.') ? quoteId.substring(7) : quoteId;
    
    const productName = `Custom Quote for ${customerName}`;

    if (!quoteId || !customerName || !customerEmail || !estimatedPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', 
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: productName,
              description: `Payment for quote: ${cleanQuoteId}`,
            },
            unit_amount: Math.round(estimatedPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        quoteId: quoteId,
      },
      success_url: `${siteUrl}/book/success?quote_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/studio/desk/quote;${quoteId}`,
    })

    const checkoutUrl = stripeSession.url
    if (!checkoutUrl) {
      throw new Error('Could not create Stripe session URL')
    }

    await sanityMutationClient
      .patch(quoteId)
      .set({
        checkoutLink: checkoutUrl,
        status: 'estimated',
      })
      .commit()

    return NextResponse.json({ url: checkoutUrl })
  } catch (err: any) {
    console.error('Error creating quote checkout session:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}