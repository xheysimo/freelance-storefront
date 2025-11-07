// src/components/CheckoutWrapper.tsx
'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import { useState } from 'react'
import ProjectBriefForm from './ProjectBriefForm' 
import SubscriptionForm from './SubscriptionForm'

// Load Stripe with your public key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Define the shape of the brief data
interface ProjectBrief {
  title: string
  fields: any[]
  formspreeEndpoint: string 
}

// 1. Update props to accept all new data from the page
export default function CheckoutWrapper({
  serviceId, // <-- 1. Get serviceId
  serviceName,
  price,
  priceSuffix,
  serviceType,
  stripePriceId,
  projectBrief,
}: {
  serviceId: string // <-- 1. Get serviceId
  serviceName: string
  price: number
  priceSuffix: string
  serviceType: 'oneOff' | 'recurring'
  stripePriceId?: string
  projectBrief?: ProjectBrief
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null) // <-- 2. Add state for orderId

  // 3. Conditionally render the correct checkout header
  const renderHeader = () => {
    if (isAuthorized) {
      return null // The ProjectBriefForm renders its own header
    }

    if (serviceType === 'recurring') {
      return (
        <>
          <h2 className="text-3xl font-bold text-center">Subscribe: {serviceName}</h2>
          <p className="mt-2 text-sm text-center text-gray-500">
            You will be redirected to Stripe to securely complete your subscription.
          </p>
        </>
      )
    }

    // Default to one-off
    return (
      <>
        <h2 className="text-3xl font-bold text-center">Book: {serviceName}</h2>
        <p className="mt-2 text-xl text-center text-gray-600 dark:text-gray-400">
          Total: £{price}
        </p>
        <p className="mt-2 text-sm text-center text-gray-500">
          Your card will be authorized, but **not charged** until the service is
          marked as complete.
        </p>
      </>
    )
  }

  // 4. Conditionally render the correct form/button
  const renderForm = () => {
    // State 1: Payment is authorized, show the project brief form
    if (isAuthorized && orderId) { // <-- 3. Check for orderId
      return projectBrief ? (
        <ProjectBriefForm 
          briefData={projectBrief} 
          orderId={orderId} // <-- 4. Pass orderId
        /> 
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Thank You!
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your card has been authorized. I'll be in touch shortly!
          </p>
        </div>
      )
    }

    // State 2: It's a recurring service, show the Subscribe button
    if (serviceType === 'recurring') {
      return (
        <SubscriptionForm
          priceId={stripePriceId!}
          price={price}
          priceSuffix={priceSuffix}
        />
      )
    }

    // State 3: It's a one-off service, show the standard authorization form
    // We must wrap this in the <Elements> provider
    return (
      <Elements stripe={stripePromise}>
        <CheckoutForm 
          amount={price} 
          serviceId={serviceId} // <-- 5. Pass serviceId
          onSuccess={(newOrderId) => { // <-- 6. Update onSuccess to receive orderId
            setOrderId(newOrderId)
            setIsAuthorized(true)
          }}
        />
      </Elements>
    )
  }

  return (
    <div className="w-full max-w-md">
      {renderHeader()}
      <div className="mt-8">
        {renderForm()}
      </div>
    </div>
  )
}