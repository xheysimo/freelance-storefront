// src/app/book/success/page.tsx
'use client'

// ---!! REMOVED server imports !! ---
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation' // <-- Import useRouter
import { Suspense, useEffect, useState } from 'react'
import { createSubscriptionOrder } from '../actions'

// Define the shape of the brief data
interface ProjectBrief {
  title: string
  fields: any[]
}

// ---!! REMOVED the entire createSubscriptionOrder function !! ---
// (It now lives in src/app/book/actions.ts)

function SuccessContent() {
  const router = useRouter() // <-- 2. Get router for client-side redirect
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const slug = searchParams.get('slug')

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectBrief, setProjectBrief] = useState<ProjectBrief | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId || !slug) {
      setError('Missing required payment information.')
      setIsLoading(false)
      return
    }

    // Call the Server Action
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

  // This will show if the subscription was successful BUT no brief was required
  // The (orderId && projectBrief) case is handled by the redirect inside useEffect
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

// Main page component
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