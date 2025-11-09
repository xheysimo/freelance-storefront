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

  const [dialog, setDialog] = useState<any>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const doc = (draft || published) as any
  const draftStatus = doc?.oneOffStatus
  const publishedStatus = published?.oneOffStatus

  const isCancelling =
    draftStatus === 'cancelled' && publishedStatus !== 'cancelled'
  const onCancelHandle = async () => {
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
      publish.execute()
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
          orderId: props.id,
          paymentIntentId: doc.stripePaymentIntentId,
        }),
      })

      const data = await res.json()
      if (res.ok) {

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

  const isChangingToPaid =
    draftStatus === 'paid' && publishedStatus !== 'paid'

  const onPublishHandle = () => {
    publish.execute()
    props.onComplete()
  }


  if (isCancelling) {
    return {
      label: 'Publish (and Cancel in Stripe)',
      tone: 'critical',
      onHandle: onCancelHandle,
    }
  }

  if (isReadyToCapture) {
    return {
      label: isCapturing ? 'Capturing...' : 'Capture Payment (Get Paid)',
      icon: () => '💸',
      tone: 'positive',
      disabled: isCapturing,
      onHandle: onCaptureHandle,
    }
  }

  return {
    label: 'Publish',
    onHandle: onPublishHandle,
  }
}