// src/sanity/actions/GeneratePaymentLinkAction.ts

import { DocumentActionDescription, DocumentActionProps } from 'sanity'
import { useState } from 'react'

export function GeneratePaymentLinkAction(
  props: DocumentActionProps
): DocumentActionDescription | null {
  const { type, draft, published } = props

  const doc = draft || published

  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState('')

  if (
    type !== 'quote' ||
    !doc ||
    !doc.estimatedPrice ||
    doc.checkoutLink ||
    doc.status !== 'new'
  ) {
    return null
  }

  async function onHandle() {
    if (!doc) {
      setMessage('Error: Document data is missing.')
      setIsGenerating(false)
      return
    }

    setIsGenerating(true)
    setMessage('Generating payment link...')

    try {
      const res = await fetch('/api/create-quote-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify({
          quoteId: doc._id,
          estimatedPrice: doc.estimatedPrice,
          customerEmail: doc.customerEmail,
          customerName: doc.customerName,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Link generated! Status set to Estimated.')
        props.onComplete()
      } else {
        setMessage(`Error: ${data.error || 'Failed to generate link'}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    }

    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  return {
    label: isGenerating ? message : 'Generate Payment Link',
    icon: () => '🔗',
    disabled: isGenerating,
    onHandle: onHandle,
    tone: 'positive',
  }
}