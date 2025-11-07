// src/app/book/success/page.tsx
import Link from 'next/link'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import { sanityFetch } from '@/sanity/lib/live'
import Stripe from 'stripe'

// This page becomes a Server Component to handle logic
async function createSubscriptionOrder(sessionId: string) {
  if (!sessionId) return
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  try {
    // 1. Get session data from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    })
    
    // --- FIX: Added checks for line_items and customer_details ---
    if (!session || !session.subscription || !session.customer_details || !session.line_items) {
      throw new Error('Could not retrieve complete session details.')
    }

    // 2. Get the product and find the matching Sanity service
    // --- FIX: Added check for price ---
    const price = session.line_items.data[0]?.price
    if (!price) {
      throw new Error('Could not find price data in session.')
    }

    const product = price.product as Stripe.Product
    const sanitySlug = product.metadata.sanity_slug

    if (!sanitySlug) {
      throw new Error('Product is missing sanity_slug metadata.')
    }

    // 3. Find the Sanity service
    const service = await sanityFetch<any>({ 
      query: `*[_type == "service" && slug.current == $slug][0]{ _id }`, 
      params: { slug: sanitySlug } 
    }).then(res => res.data)

    if (!service) {
      throw new Error(`Could not find service with slug: ${sanitySlug}`)
    }

    // 4. Create the Sanity Order
    const doc = {
      _type: 'order',
      service: {
        _type: 'reference',
        _ref: service._id,
      },
      stripeSubscriptionId: session.subscription as string,
      status: 'inProgress', // Subscriptions are active immediately
      customerName: session.customer_details.name || 'N/A',
      customerEmail: session.customer_details.email || 'N/A',
      projectBrief: 'N/A - Recurring Subscription',
    }

    // --- FIX: Changed createOrReplace to create ---
    await sanityMutationClient.create(doc)
    console.log(`Successfully created order for subscription: ${session.subscription}`)

  } catch (err: any) {
    console.error(`Error in createSubscriptionOrder: ${err.message}`)
    // We don't want to block the user, so we just log the error
  }
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  
  // Run the server-side logic
  const sessionId = searchParams?.session_id as string | undefined
  if (sessionId) {
    await createSubscriptionOrder(sessionId)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Thank You!
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Your subscription is all set up.
      </p>
      <p className="mt-2 text-gray-500">
        You will receive a confirmation email shortly.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Back to Homepage
      </Link>
    </main>
  )
}