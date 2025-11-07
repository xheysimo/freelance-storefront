// src/components/CheckoutForm.tsx
'use client'

import { FormEvent, useState } from 'react'
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js'

export default function CheckoutForm({
  amount,
  onSuccess, // <-- 1. Add onSuccess prop
}: {
  amount: number
  onSuccess: () => void // <-- 2. Define its type
}) {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) {
      return // Stripe.js has not yet loaded.
    }

    setIsLoading(true)
    setMessage('Authorizing...')

    // 1. Create the PaymentIntent on your server
    const res = await fetch('/api/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Amount is in pence, so multiply by 100
        amount: amount * 100, 
      }),
    })

    const { clientSecret, error: backendError } = await res.json()

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
        },
      }
    )

    if (stripeError) {
      // Show error to your customer
      setMessage(stripeError.message || 'An unknown error occurred')
    } else {
      // Show a success message
      // The card has been authorized, but NOT charged
      setMessage(
        'Success! Your card has been authorized.'
      )
      onSuccess() // <-- 3. Call onSuccess!
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Card Details
      </label>
      <div className="mt-1 p-3 border rounded-md bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardElement
          options={{
            style: {
              base: {
                color: '#ffffff', // Change color based on dark/light mode if you wish
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

      <button
        disabled={isLoading || !stripe}
        className="mt-6 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {isLoading
          ? 'Processing...'
          : `Authorize £${amount} (Not Charged Yet)`}
      </button>

      {message && (
        <div className="mt-4 text-center text-sm text-green-600 dark:text-green-400"> {/* <-- Changed to green for success */}
          {message}
        </div>
      )}
    </form>
  )
}