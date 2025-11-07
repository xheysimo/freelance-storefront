// src/components/checkout/CheckoutForm.tsx
'use client'

import { FormEvent, useState, ChangeEvent } from 'react' // <-- 1. Import ChangeEvent
import {
  useStripe,
  useElements,
  CardElement,
  // --- FIX: Removed EmailElement ---
} from '@stripe/react-stripe-js'

export default function CheckoutForm({
  amount,
  serviceId,
  onSuccess,
}: {
  amount: number
  serviceId: string
  onSuccess: (orderId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('') // <-- This state is now used by our input

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) {
      return // Stripe.js has not yet loaded.
    }

    if (!email) {
      setMessage('Please enter your email.')
      return
    }

    setIsLoading(true)
    setMessage('Authorizing...')

    // 1. Create the PaymentIntent on your server
    const res = await fetch('/api/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount * 100, 
        email: email, // <-- Send email to API
      }),
    })

    const { clientSecret, paymentIntentId, error: backendError } = await res.json()

    if (backendError) {
      setMessage(`Error from server: ${backendError}`)
      setIsLoading(false)
      return
    }

    // 2. Get the CardElement
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setMessage('Card element not found')
      setIsLoading(false)
      return
    }

    // 3. Confirm the card payment with the client_secret
    const { error: stripeError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: { email: email }, // <-- Add email to billing
        },
      }
    )

    if (stripeError) {
      setMessage(stripeError.message || 'An unknown error occurred')
    } else {
      // 4. Call our NEW /api/create-order endpoint
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
          onSuccess(orderId) // <-- Pass back the new orderId
        }
      } catch (err) {
        setMessage('Payment authorized, but failed to create order. Please contact support.')
      }
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {/* --- FIX: Replaced EmailElement with standard input --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            value={email}
            // --- FIX: Added type to 'e' ---
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm p-3"
          />
        </div>
      </div>
      {/* --- END FIX --- */}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Card Details
        </label>
        <div className="mt-1 p-3 border rounded-md bg-white dark:border-gray-700 dark:bg-gray-800">
          <CardElement
            options={{
              style: {
                base: {
                  color: '#ffffff', // Change color based on dark/light mode
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
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400"> 
          {message}
        </div>
      )}
    </form>
  )
}