// src/sanity/actions/CapturePaymentAction.ts
import { DocumentActionDescription, DocumentActionProps } from 'sanity'
import { useState } from 'react'

// --- FIX: Updated return type ---
export function CapturePaymentAction(props: DocumentActionProps): DocumentActionDescription | null {
  const { type, published } = props
  const doc = published as any // Get the published document
  const [isCapturing, setIsCapturing] = useState(false)
  const [message, setMessage] = useState('')

  // This action should only appear for 'order' documents that
  // are 'completed' and have a 'paymentIntentId'
  if (
    type !== 'order' ||
    !doc ||
    doc.status !== 'completed' ||
    !doc.stripePaymentIntentId
  ) {
    return null // --- This is now valid
  }

  async function onHandle() {
    setIsCapturing(true)
    setMessage('Capturing...')

    try {
      const res = await fetch('/api/capture-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Send your secret to authenticate the request
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify({
          orderId: doc._id,
          paymentIntentId: doc.stripePaymentIntentId,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Payment Captured Successfully! Status set to Paid.')
        // Force a re-fetch of the document
        props.onComplete() 
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (err: any) { // --- FIX: Cast err to any ---
      setMessage(`Error: ${err.message}`)
    }
    setIsCapturing(false)
  }

  return {
    label: isCapturing ? message : 'Capture Payment (Get Paid)',
    icon: () => '💸',
    disabled: isCapturing,
    onHandle: onHandle,
  }
}