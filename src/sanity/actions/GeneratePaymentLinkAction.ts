// src/sanity/actions/GeneratePaymentLinkAction.ts

import { DocumentActionDescription, DocumentActionProps } from 'sanity'
import { useState } from 'react'

export function GeneratePaymentLinkAction(
  props: DocumentActionProps
): DocumentActionDescription | null {
  // --- THIS IS THE FIX ---
  // Removed the stray underscore '_' after the closing brace
  const { type, draft, published } = props
  // --- END OF FIX ---

  // The 'doc' variable can be null if the document is new and not yet saved
  const doc = draft || published

  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState('')

  // This action should only appear for 'quote' documents that:
  // 1. Are of type 'quote'
  // 2. Have a document (draft or published)
  // 3. Have an estimatedPrice set
  // 4. Do NOT already have a checkoutLink
  // 5. Have a status of 'new'
  if (
    type !== 'quote' ||
    !doc || // This check narrows the type for the return, but not inside onHandle
    !doc.estimatedPrice ||
    doc.checkoutLink ||
    doc.status !== 'new'
  ) {
    return null
  }

  async function onHandle() {
    // Add a null check inside the handler to satisfy TypeScript
    // and prevent runtime errors.
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
          // Use the same webhook secret for auth
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify({
          // Now TypeScript knows 'doc' is not null here
          quoteId: doc._id,
          estimatedPrice: doc.estimatedPrice,
          customerEmail: doc.customerEmail,
          customerName: doc.customerName,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Link generated! Status set to Estimated.')
        // Tell Sanity to refresh the document data
        props.onComplete()
      } else {
        setMessage(`Error: ${data.error || 'Failed to generate link'}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    }

    // Don't reset loading state immediately, so user can read message
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  return {
    label: isGenerating ? message : 'Generate Payment Link',
    icon: () => '🔗',
    disabled: isGenerating,
    onHandle: onHandle,
    // Set a prominent color for the button
    tone: 'positive',
  }
}