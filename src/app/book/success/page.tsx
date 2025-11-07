// src/app/book/success/page.tsx
import Link from 'next/link'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'
import ProjectBriefForm from '@/components/checkout/ProjectBriefForm'
// UPGRADE 1: Import new icons for success and error states
import { CheckCircle, XCircle, FileText, Home, ArrowRight } from 'lucide-react' 

// ... (interface ProjectBrief is unchanged) ...
interface ProjectBrief {
  title: string
  fields: any[]
}

// 1. Update the result interface to include an error
interface OrderCreationResult {
  orderId: string | null
  projectBrief: ProjectBrief | null
  error?: string 
}

async function createSubscriptionOrder(
  sessionId: string,
  slug: string
): Promise<OrderCreationResult> {
  if (!sessionId || !slug) {
    return { orderId: null, projectBrief: null, error: 'Missing session ID or service slug.' }
  }

  // NOTE: In a real environment, you should use server-side logic (e.g., API route)
  // to fetch the secret key and communicate with Stripe, not the client environment.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    })

    if (!session || !session.subscription || !session.customer_details) {
      throw new Error('Could not retrieve complete session details.')
    }

    const subscriptionId = session.subscription as string

    // 1. Check if an order with this subscription ID already exists
    const existingOrder = await sanityMutationClient.fetch<any>(
      `*[_type == "order" && stripeSubscriptionId == $subscriptionId][0]{ 
        _id,
        service->{ 
          projectBrief->{
            title,
            fields
          }
        } 
      }`,
      { subscriptionId: subscriptionId }
    )

    // 2. If it exists, return the existing orderId and brief
    if (existingOrder) {
      console.log(`Found existing order: ${existingOrder._id}`)
      return {
        orderId: existingOrder._id,
        projectBrief: existingOrder.service?.projectBrief || null,
      }
    }

    // 3. If no existing order, fetch the service to create a new one
    const service = await sanityMutationClient.fetch<any>(
      `*[_type == "service" && slug.current == $slug][0]{ 
        _id,
        title, // Fetch title for confirmation message
        projectBrief->{ 
          title,
          fields
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
        // Store service title in order doc for easy lookup
        title: service.title, 
      },
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'inProgress',
      customerName: session.customer_details.name || 'N/A',
      customerEmail: session.customer_details.email || 'N/A',
      projectBrief: service.projectBrief
        ? 'Pending submission...'
        : 'N/A - Recurring Subscription',
    }

    const newOrder = await sanityMutationClient.create(doc)
    console.log(
      `Successfully created order ${newOrder._id} for subscription: ${subscriptionId}`
    )

    return {
      orderId: newOrder._id,
      projectBrief: service.projectBrief || null,
    }
  } catch (err: any) {
    console.error(`Error in createSubscriptionOrder: ${err.message}`)
    // 2. Return the error message instead of just nulls
    return { orderId: null, projectBrief: null, error: err.message }
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

  let orderResult: OrderCreationResult = { orderId: null, projectBrief: null }

  if (sessionId && slug) {
    orderResult = await createSubscriptionOrder(sessionId, slug)
  }

  const { orderId, projectBrief, error } = orderResult
  
  // --- ERROR STATE ---
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-950">
        <div className="w-full max-w-lg p-10 rounded-2xl border-4 border-red-200 dark:border-red-900 bg-red-50 dark:bg-gray-900 shadow-xl">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold tracking-tight text-red-700 sm:text-4xl">
              Order Creation Failed
            </h1>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
              Your payment was successful, but there was an unexpected error finalizing your order.
            </p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-300 dark:border-red-700">
                **CRITICAL ERROR:** <code className='break-all font-mono'>{error}</code>
            </p>
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
              **Please contact support immediately** with the error code above so we can manually activate your service.
            </p>
            
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center rounded-xl bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-red-500 transition"
            >
              <FileText className="h-5 w-5 mr-2" /> Contact Support Now
            </Link>
        </div>
      </main>
    )
  }

  // --- SUCCESS STATE: PROJECT BRIEF REQUIRED ---
  if (orderId && projectBrief) {
    return (
      <main className="w-full bg-gray-50 dark:bg-gray-900 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="text-center mb-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    Payment Successful!
                </h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                    Your order **#{orderId.substring(0, 8)}** is confirmed. Let's get started right away.
                </p>
            </div>
            
            {/* Brief Form Card - Prominent Action */}
            <div className="bg-white dark:bg-gray-950 p-8 md:p-12 rounded-2xl shadow-2xl border-4 border-indigo-600 dark:border-indigo-400">
                <div className="flex items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <FileText className="h-6 w-6 text-indigo-600 mr-3 shrink-0" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Action Required: Submit Project Brief
                    </h2>
                </div>
                <p className='text-lg text-gray-700 dark:text-gray-300 mb-8'>
                    To initiate development on **{projectBrief.title}**, please provide the necessary details below.
                </p>
                <ProjectBriefForm briefData={projectBrief} orderId={orderId} />
            </div>

            {/* Next Steps */}
            <div className="mt-12 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    You will receive a copy of your completed brief and payment confirmation via email.
                </p>
                <Link
                    href="/"
                    className="mt-4 inline-flex items-center text-base font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    Back to Homepage <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
            </div>
        </div>
      </main>
    )
  }

  // --- SUCCESS STATE: NO BRIEF REQUIRED (FALLBACK) ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-950">
        <div className="w-full max-w-lg p-10 rounded-2xl border-4 border-green-200 dark:border-green-900 bg-green-50 dark:bg-gray-900 shadow-xl">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold tracking-tight text-green-700 sm:text-5xl">
                Order Confirmed!
            </h1>
            <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
                Thank you for your business. Your order is all set up and processing.
            </p>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                You will receive a confirmation email shortly with full details of your subscription.
            </p>
            
            <Link
                href="/"
                className="mt-8 inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
                <Home className="h-5 w-5 mr-2" /> Continue to Dashboard
            </Link>
        </div>
    </main>
  )
}