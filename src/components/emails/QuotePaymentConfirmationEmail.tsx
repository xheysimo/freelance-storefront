// src/components/emails/QuotePaymentConfirmationEmail.tsx
import * as React from 'react'

interface EmailProps {
  name: string
  amount: number
  quoteId: string
}

/**
 * Email template for confirming a successful QUOTE payment.
 */
export const QuotePaymentConfirmationEmail: React.FC<Readonly<EmailProps>> = ({
  name,
  amount,
  quoteId,
}) => (
  <div
    style={{
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
      padding: '20px',
      lineHeight: '1.5',
    }}
  >
    <h1 style={{ color: '#333', fontSize: '24px' }}>Hi {name},</h1>
    <p style={{ color: '#555', fontSize: '16px' }}>
      This is to confirm we have successfully received your payment of{' '}
      <strong>
        £{amount.toLocaleString('en-GB', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </strong>{' '}
      for quote (Ref: {quoteId}).
    </p>
    <p style={{ color: '#555', fontSize: '16px' }}>
      We will begin work on your project shortly and will be in touch with
      an update.
    </p>
    <p style={{ color: '#777', fontSize: '14px', marginTop: '30px' }}>
      Thanks,
      <br />
      The QuickDev Team
    </p>
  </div>
)

export default QuotePaymentConfirmationEmail