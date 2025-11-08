// src/sanity/actions/PublishOrderAction.ts
'use client'

import { useState } from 'react'
import {
  DocumentActionDescription,
  DocumentActionProps,
  useDocumentOperation,
} from 'sanity'

export function PublishOrderAction(
  props: DocumentActionProps
): DocumentActionDescription | null {
  const { id, type, draft, published } = props
  const { publish } = useDocumentOperation(id, type)

  // We need state for both cancelling and capturing
  const [dialog, setDialog] = useState<any>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  // Get status from the draft (your changes)
  const doc = (draft || published) as any // Use draft first
  const draftStatus = doc?.oneOffStatus
  const publishedStatus = published?.oneOffStatus

  // --- Check 1: Is user trying to CANCEL? ---
  const isCancelling =
    draftStatus === 'cancelled' && publishedStatus !== 'cancelled'
  const onCancelHandle = async () => {
    // (This logic is unchanged from before)
    setDialog({
      type: 'modal',
      content: 'Processing cancellation in Stripe...',
      onClose: () => {},
    })
    let apiEndpoint = ''
    let payload: any = {}
    if (doc.stripePaymentIntentId) {
      apiEndpoint = '/api/cancel-payment-intent'
      payload = {
        orderId: id,
        paymentIntentId: doc.stripePaymentIntentId,
      }
    } else if (doc.stripeSubscriptionId) {
      apiEndpoint = '/api/cancel-subscription'
      payload = { subscriptionId: doc.stripeSubscriptionId }
    }
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to cancel in Stripe.')
      }
      publish.execute() // Publish the 'cancelled' status
      props.onComplete()
      setDialog(null)
    } catch (err: any) {
      setDialog({
        type: 'dialog',
        tone: 'critical',
        title: 'Stripe Cancellation Failed',
        content: `Error: ${err.message}. The order has NOT been published.`,
        onClose: () => setDialog(null),
      })
    }
  }

  // --- Check 2: Is user trying to CAPTURE (Get Paid)? ---
  // THIS IS THE NEW LOGIC
  const isReadyToCapture =
    draftStatus === 'completed' && doc.stripePaymentIntentId
  const onCaptureHandle = async () => {
    setIsCapturing(true)
    setDialog({
      type: 'modal',
      content: 'Capturing payment in Stripe...',
      onClose: () => {},
    })

    try {
      const res = await fetch('/api/capture-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify({
          // --- THIS IS THE FIX ---
          // Use the canonical ID (`props.id`) not the draft ID (`doc._id`)
          orderId: props.id,
          // --- END OF FIX ---
          paymentIntentId: doc.stripePaymentIntentId,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        // Stripe succeeded. The API route has set the status to 'paid'.
        // We just need to tell the UI to refresh.

        // --- THIS IS THE FIX ---
        // The line `await props.client.patch(...)` was removed.
        // We just call onComplete() to close the modal.
        // The Studio will see the document changed and refresh itself.
        // --- END OF FIX ---

        props.onComplete()
        setDialog(null)
      } else {
        throw new Error(data.error || 'Failed to capture payment.')
      }
    } catch (err: any) {
      setDialog({
        type: 'dialog',
        tone: 'critical',
        title: 'Payment Capture Failed',
        content: `Error: ${err.message}.`,
        onClose: () => setDialog(null),
      })
    }
    setIsCapturing(false)
  }

  // --- Check 3: Is user trying to set to 'Paid' manually? ---
  const isChangingToPaid =
    draftStatus === 'paid' && publishedStatus !== 'paid'

  // --- Check 4: Is this just a normal publish? ---
  const onPublishHandle = () => {
    publish.execute()
    props.onComplete()
  }

  // --- NOW, RETURN THE CORRECT BUTTON ---

  if (isCancelling) {
    return {
      label: 'Publish (and Cancel in Stripe)',
      tone: 'critical',
      onHandle: onCancelHandle,
    }
  }

  if (isReadyToCapture) {
    // Here is the fix! We show the "Get Paid" button
    // This button will run the capture logic *instead* of publishing.
    return {
      label: isCapturing ? 'Capturing...' : 'Capture Payment (Get Paid)',
      icon: () => '💸',
      tone: 'positive', // Make it green
      disabled: isCapturing,
      onHandle: onCaptureHandle,
    }
  }

  // If none of the above, return the default "Publish" button
  return {
    label: 'Publish',
    onHandle: onPublishHandle,
  }
}