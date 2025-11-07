// src/app/book/success/page.tsx
import Link from 'next/link'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'
import ProjectBriefForm from '@/components/checkout/ProjectBriefForm' 

// ... (interface definitions are unchanged) ...
interface ProjectBrief {
  title: string
  fields: any[]
  formspreeEndpoint: string 
}

interface OrderCreationResult {
  orderId: string | null
  projectBrief: ProjectBrief | null
}

async function createSubscriptionOrder(
  sessionId: string, 
  slug: string
): Promise<OrderCreationResult> {
  if (!sessionId || !slug) {
    return { orderId: null, projectBrief: null }
  }
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    })
    
    if (!session || !session.subscription || !session.customer_details) {
      throw new Error('Could not retrieve complete session details.')
    }
    
    const subscriptionId = session.subscription as string;

    // 1. Check if an order with this subscription ID already exists
    const existingOrder = await sanityMutationClient.fetch<any>(
      `*[_type == "order" && stripeSubscriptionId == $subscriptionId][0]{ 
        _id,
        service->{ 
          projectBrief->{
            title,
            fields,
            formspreeEndpoint
          }
        } 
      }`,
      { subscriptionId: subscriptionId }
    );

    // 2. If it exists, return the existing orderId and brief
    if (existingOrder) {
      console.log(`Found existing order: ${existingOrder._id}`);
      return {
        orderId: existingOrder._id,
        projectBrief: existingOrder.service?.projectBrief || null
      }
    }

    // 3. If no existing order, fetch the service to create a new one
    const service = await sanityMutationClient.fetch<any>(
      `*[_type == "service" && slug.current == $slug][0]{ 
        _id,
        projectBrief->{ 
          title,
          fields,
          formspreeEndpoint
        } 
      }`, 
      { slug: slug }
    )

    if (!service) {
      throw new Error(`Could not find service with slug: ${slug}`)
    }

    // 4. Create the Sanity Order
    const doc = {
      _type: 'order',
      service: {
        _type: 'reference',
        _ref: service._id,
      },
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'inProgress', // <-- FIX
      customerName: session.customer_details.name || 'N/A',
      customerEmail: session.customer_details.email || 'N/A',
      projectBrief: service.projectBrief 
        ? 'Pending submission...' 
        : 'N/A - Recurring Subscription',
    }

    const newOrder = await sanityMutationClient.create(doc) 
    console.log(`Successfully created order ${newOrder._id} for subscription: ${subscriptionId}`)

    return {
      orderId: newOrder._id,
      projectBrief: service.projectBrief || null
    }

  } catch (err: any) {
    console.error(`Error in createSubscriptionOrder: ${err.message}`)
    return { orderId: null, projectBrief: null } 
  }
}

/**
 * Page Component
 */
export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  
  const resolvedSearchParams = await searchParams;

  const sessionId = resolvedSearchParams?.session_id as string | undefined
  const slug = resolvedSearchParams?.slug as string | undefined 
  
  let orderResult: OrderCreationResult = { orderId: null, projectBrief: null };

  if (sessionId && slug) {
    orderResult = await createSubscriptionOrder(sessionId, slug)
  }

  const { orderId, projectBrief } = orderResult;

  // Show brief form if one is associated with the order
  if (orderId && projectBrief) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-12">
        <div className="w-full max-w-md">
          <ProjectBriefForm 
            briefData={projectBrief} 
            orderId={orderId} 
          />
        </div>
      </main>
    )
  }

  // Fallback "Thank You" message
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Thank You!
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Your subscription is all set up.
      </p>
      <p className="mt-2 text-sm text-gray-500">
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