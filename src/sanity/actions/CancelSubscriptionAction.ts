// src/sanity/actions/CancelSubscriptionAction.ts
import { DocumentActionDescription, DocumentActionProps } from 'sanity'
import { useState } from 'react'

export function CancelSubscriptionAction(props: DocumentActionProps): DocumentActionDescription | null {
  const { type, published } = props
  const doc = published as any // Get the published document
  const [isCancelling, setIsCancelling] = useState(false)
  const [message, setMessage] = useState('')

  // This action should only appear for 'order' documents that
  // are subscriptions and are not already cancelled.
  if (
    type !== 'order' ||
    !doc ||
    !doc.stripeSubscriptionId || // Must be a subscription
    doc.subscriptionStatus === 'cancelled' // Must not be cancelled
  ) {
    return null
  }

  async function onHandle() {
    setIsCancelling(true)
    setMessage('Cancelling in Stripe...')

    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Send your secret to authenticate the request
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify({
          subscriptionId: doc.stripeSubscriptionId,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Cancellation sent! Status will update shortly.')
        // Force a re-fetch of the document
        // The webhook will update the status, and this refetch will show it.
        props.onComplete() 
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    }
    setIsCancelling(false)
  }

  return {
    label: isCancelling ? message : 'Cancel Stripe Subscription',
    icon: () => '❌',
    tone: 'critical', // Makes the button red
    disabled: isCancelling,
    onHandle: onHandle,
  }
}