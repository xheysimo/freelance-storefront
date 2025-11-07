// src/components/checkout/SubscriptionForm.tsx
'use client'

import { useState } from 'react'

export default function SubscriptionForm({
  priceId,
  price,
  priceSuffix,
  serviceSlug, // <-- 1. ACCEPT THE SLUG
}: {
  priceId: string
  price: number
  priceSuffix: string
  serviceSlug: string // <-- 1. ACCEPT THE SLUG
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. SEND THE SLUG IN THE BODY
        body: JSON.stringify({ priceId, serviceSlug }), 
      })

      const { url, error } = await res.json()

      if (error) {
        setMessage(`Error from server: ${error}`)
        setIsLoading(false)
        return
      }

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      }
    } catch (err: any) {
      setMessage('An unknown error occurred.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      {/* ... (form JSX is unchanged) ... */}
      <div className="text-center">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          £{price}
        </span>
        <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
          {priceSuffix}
        </span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Subscribe Now'}
      </button>

      <p className="mt-2 text-sm text-center text-gray-500">
        You will be redirected to Stripe to complete your subscription.
      </p>

      {message && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {message}
        </div>
      )}
    </form>
  )
}