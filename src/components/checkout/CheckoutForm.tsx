// src/components/checkout/CheckoutForm.tsx
'use client'

import { FormEvent, useState, ChangeEvent, useEffect } from 'react'
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js'
import { Session } from 'next-auth'

export default function CheckoutForm({
  amount,
  serviceId,
  onSuccess,
  session,
}: {
  amount: number
  serviceId: string
  onSuccess: (orderId: string) => void
  session: Session | null
}) {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
    if (!stripe || !elements) {
      return
    }

    if (!email || !name) {
      setMessage('Please enter your name and email.')
      return
    }

    setIsLoading(true)
    setMessage('Authorizing...')

    const res = await fetch('/api/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount * 100, 
        email: email,
        name: name,
      }),
    })

    const { clientSecret, paymentIntentId, error: backendError } = await res.json()

    if (backendError) {
      setMessage(`Error from server: ${backendError}`)
      setIsLoading(false)
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setMessage('Card element not found')
      setIsLoading(false)
      return
    }

    const { error: stripeError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: { 
            email: email,
            name: name,
          },
        },
      }
    )

    if (stripeError) {
      setMessage(stripeError.message || 'An unknown error occurred')
    } else {
      try {
        const orderRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId, serviceId }),
        })
        const { orderId, error: orderError } = await orderRes.json()

        if (orderError) {
          setMessage(`Payment authorized, but failed to create order: ${orderError}`)
        } else {
          setMessage('Success! Your card has been authorized.')
          onSuccess(orderId) 
        }
      } catch (err) {
        setMessage('Payment authorized, but failed to create order. Please contact support.')
      }
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Your Name"
            required
            disabled={!!session}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm p-3 disabled:bg-gray-100 dark:disabled:bg-gray-700"
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={!!session}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm p-3 disabled:bg-gray-100 dark:disabled:bg-gray-700"
          />
        </div>
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Card Details
        </label>
        <div className="mt-1 p-3 border rounded-md bg-white dark:border-gray-700 dark:bg-gray-800">
          <CardElement
            options={{
              style: {
                base: {
                  color: '#111827', 
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSmoothing: 'antialiased',
                  fontSize: '16px',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a',
                },
              },
              ...((typeof window !== "undefined" && window.matchMedia('(prefers-color-scheme: dark)').matches) ? {
                style: {
                  base: {
                    color: '#ffffff',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                      color: '#6b7280',
                    },
                  },
                  invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a',
                  },
                }
              } : {})
            }}
          />
        </div>
      </div>

      <button
        disabled={isLoading || !stripe || !elements}
        className="mt-6 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {isLoading
          ? 'Processing...'
          : `Authorize £${amount} (Not Charged Yet)`}
      </button>

      {message && (
        <div className={`mt-4 text-center text-sm ${message.startsWith('Success') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}> 
          {message}
        </div>
      )}
    </form>
  )
}