// src/app/api/checkout-session/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions' // Import from your central lib file
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

export async function POST(request: Request) {
  try {
    const { priceId, serviceSlug, email, name } = await request.json()
    const session = await getServerSession(authOptions)
    
    let stripeCustomerId: string | undefined;

    if (session?.user?.email) {
      // --- USER IS LOGGED IN ---
      const user = await sanityMutationClient.fetch<any>(
        `*[_type == "user" && email == $email][0]{ _id, stripeCustomerId }`,
        { email: session.user.email }
      )
      
      if (user?.stripeCustomerId) {
        stripeCustomerId = user.stripeCustomerId
      } else {
        // Fallback: Logged-in user has no Stripe ID. Create one.
        console.warn(`User ${session.user.email} is logged in but has no stripeCustomerId. Creating one now.`)
        
        const customer = await stripe.customers.create({ 
          email: session.user.email,
          name: session.user.name ?? undefined 
        });

        stripeCustomerId = customer.id;
        // Patch the Sanity user with the new Stripe ID
        if (user?._id) {
          await sanityMutationClient.patch(user._id).set({ stripeCustomerId: customer.id }).commit()
        }
      }
    } else {
      // --- USER IS A GUEST ---
      if (!email || !name) {
        return NextResponse.json({ error: 'Email and name are required for guests' }, { status: 400 });
      }

      // Find or create customer
      const customerList = await stripe.customers.list({ email: email, limit: 1 });
      if (customerList.data.length > 0) {
        stripeCustomerId = customerList.data[0].id;
      } else {
        const customer = await stripe.customers.create({ email, name });
        stripeCustomerId = customer.id;
      }
    }

    // --- Create the Stripe checkout session ---
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}&slug=${serviceSlug}`,
      cancel_url: `${siteUrl}/book/${serviceSlug}`,
      metadata: {
        serviceSlug,
      },
      customer: stripeCustomerId, 
    })

    // ---!! THIS IS THE FIX !! ---
    // Return the full URL, not just the ID
    return NextResponse.json({ url: stripeSession.url })
    // ---!! END OF FIX !! ---

  } catch (err: any) {
    console.error('Error creating checkout session:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}