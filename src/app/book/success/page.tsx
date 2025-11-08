// src/app/book/success/page.tsx
'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { createSubscriptionOrder } from '../actions' // Used for subscription flow

// Define the shape of the brief data (unchanged)
interface ProjectBrief {
  title: string
  fields: any[]
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Check for Subscription parameters
  const sessionId = searchParams.get('session_id')
  const slug = searchParams.get('slug')

  // Check for Quote parameters (NEW)
  const quoteSessionId = searchParams.get('quote_session_id')

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectBrief, setProjectBrief] = useState<ProjectBrief | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  // --- NEW: Handle Quote Success FIRST ---
  if (quoteSessionId) {
    // If quoteSessionId is present, the payment was for a quote.
    // The Sanity update was handled by the webhook, so we can render success immediately.
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Payment Received!
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Thank you for your payment. Your quote is now confirmed and our team will be in touch shortly.
        </p>
        <p className="mt-2 text-gray-500">
          You will receive a confirmation email shortly.
        </p>
        <Link
          href="/account"
          className="mt-8 inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Go to My Account
        </Link>
      </div>
    )
  }
  // --- END Quote Success Handling ---

  useEffect(() => {
    // --- Subscription Flow: Only proceed if both subscription params are present ---
    if (!sessionId || !slug) {
      // This is the fallback for missing params when it's NOT a quote payment.
      setError('Missing required payment information.')
      setIsLoading(false)
      return
    }

    // Call the Server Action (Subscription Logic)
    createSubscriptionOrder(sessionId, slug)
      .then((result) => {
        if (result.error) {
          setError(result.error)
        } else {
          setOrderId(result.orderId)
          setProjectBrief(result.projectBrief)
          
          // 3. If a brief is required, redirect the user
          if (result.orderId && result.projectBrief) {
            router.push(`/book/submit-brief?orderId=${result.orderId}`)
          }
        }
      })
      .catch((err) => {
        // This will catch network errors
        setError(err.message || 'An unexpected error occurred.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [sessionId, slug, router])

  if (isLoading) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          Securing your subscription...
        </h2>
        <p className="mt-2 text-gray-500">
          Please wait, we are creating your order.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
          Payment Error
        </h2>
        <p className="mt-2 text-gray-500">{error}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Go back home
        </Link>
      </div>
    )
  }

  // This is the default success message for subscription payments
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Subscription Successful!
      </h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Thank you for subscribing! Your order ({orderId}) has been confirmed.
      </p>
      <p className="mt-2 text-gray-500">
        You will receive a confirmation email shortly.
      </p>
      <Link
        href="/account"
        className="mt-8 inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Go to My Account
      </Link>
    </div>
  )
}

// Main page component (unchanged)
export default function SuccessPage() {
  return (
    <main className="w-full py-20 sm:py-24 bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
      <div className="w-full max-w-lg p-8 bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <Suspense
          fallback={
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  )
}