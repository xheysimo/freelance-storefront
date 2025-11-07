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
}

// 1. Update props to accept all new data from the page
export default function CheckoutWrapper({
  serviceId, 
  serviceName,
  price,
  priceSuffix,
  serviceType,
  stripePriceId,
  projectBrief,
  serviceSlug, // <-- 1. ACCEPT THE SLUG
}: {
  serviceId: string 
  serviceName: string
  price: number
  priceSuffix: string
  serviceType: 'oneOff' | 'recurring'
  stripePriceId?: string
  projectBrief?: ProjectBrief
  serviceSlug: string // <-- 1. ACCEPT THE SLUG
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null) 

  // ... (renderHeader function is unchanged) ...
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
    if (isAuthorized && orderId) { 
      return projectBrief ? (
        <ProjectBriefForm 
          briefData={projectBrief} 
          orderId={orderId} 
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
          serviceSlug={serviceSlug} // <-- 2. PASS SLUG TO SUB FORM
        />
      )
    }

    // State 3: It's a one-off service, show the standard authorization form
    return (
      <Elements stripe={stripePromise}>
        <CheckoutForm 
          amount={price} 
          serviceId={serviceId} 
          onSuccess={(newOrderId) => { 
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