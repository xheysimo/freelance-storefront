// src/components/checkout/SubscriptionForm.tsx
'use client'

import { FormEvent, useState, useEffect } from 'react'
import { Session } from 'next-auth'

export default function SubscriptionForm({
  priceId,
  price,
  priceSuffix,
  serviceSlug,
  session,
}: {
  priceId: string
  price: number
  priceSuffix: string
  serviceSlug: string
  session: Session | null
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [name, setName] = useState(session?.user?.name || '')

  useEffect(() => {
    if (session) {
      setEmail(session.user?.email || '')
      setName(session.user?.name || '')
    }
  }, [session])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage('Redirecting to Stripe...')

    const res = await fetch('/api/checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        serviceSlug,
        email,
        name,
      }),
    })

    const { url, error } = await res.json()

    if (error) {
      setMessage(`Error: ${error}`)
      setIsLoading(false)
    } else if (url) {
      window.location.href = url
    } else {
      setMessage('An unknown error occurred. Missing redirect URL.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      
      {!session && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm p-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm p-3"
              />
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {isLoading
          ? 'Processing...'
          : `Subscribe for £${price}/${priceSuffix}`}
      </button>

      {message && (
        <div className={`mt-4 text-center text-sm text-red-600 dark:text-red-400`}>
          {message}
        </div>
      )}
    </form>
  )
}