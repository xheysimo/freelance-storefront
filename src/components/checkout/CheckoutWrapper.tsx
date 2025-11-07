// src/components/CheckoutWrapper.tsx
'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'

// Load Stripe with your public key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function CheckoutWrapper({
  serviceName,
  price,
}: {
  serviceName: string
  price: number
}) {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-center">Book: {serviceName}</h2>
      <p className="mt-2 text-xl text-center text-gray-600 dark:text-gray-400">
        Total: £{price}
      </p>
      <p className="mt-2 text-sm text-center text-gray-500">
        Your card will be authorized, but **not charged** until the service is
        marked as complete.
      </p>
      <div className="mt-8">
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={price} />
        </Elements>
      </div>
    </div>
  )
}