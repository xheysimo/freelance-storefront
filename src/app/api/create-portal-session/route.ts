// src/app/api/create-portal-session/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Look up the customer in Sanity by their email
    const query = `*[_type == "order" && customerEmail == $email && defined(stripeCustomerId)][0]{
      stripeCustomerId
    }`
    const order = await sanityMutationClient.fetch<{ stripeCustomerId: string }>(query, { 
      email: session.user.email 
    })

    if (!order?.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found for this email.' }, { status: 404 })
    }

    // 2. Create a Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: order.stripeCustomerId,
      return_url: `${siteUrl}/account` // Return to the account page
    })

    // 3. Return the URL
    return NextResponse.json({ url: portalSession.url })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}