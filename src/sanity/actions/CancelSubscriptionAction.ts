// src/sanity/actions/CancelSubscriptionAction.ts
import { DocumentActionDescription, DocumentActionProps } from 'sanity'
import { useState } from 'react'

export function CancelSubscriptionAction(props: DocumentActionProps): DocumentActionDescription | null {
  const { type, published } = props
  const doc = published as any
  const [isCancelling, setIsCancelling] = useState(false)
  const [message, setMessage] = useState('')

  if (
    type !== 'order' ||
    !doc ||
    !doc.stripeSubscriptionId ||
    doc.subscriptionStatus === 'cancelled'
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
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify({
          subscriptionId: doc.stripeSubscriptionId,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Cancellation sent! Status will update shortly.')
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
    tone: 'critical',
    disabled: isCancelling,
    onHandle: onHandle,
  }
}