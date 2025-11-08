// src/components/emails/PaymentConfirmationEmail.tsx
import * as React from 'react'

interface EmailProps {
  name: string
  orderId: string
  serviceName: string
}

/**
 * Email template for confirming a successful payment capture (order completion).
 */
export const PaymentConfirmationEmail: React.FC<Readonly<EmailProps>> = ({
  name,
  orderId,
  serviceName,
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
      Your payment for <strong>{serviceName}</strong> (Order {orderId}) has
      been successfully captured, and the order is now complete.
    </p>
    <p style={{ color: '#555', fontSize: '16px' }}>
      Thank you for your business! You can view all your completed orders in
      your account dashboard.
    </p>
    <p style={{ color: '#777', fontSize: '14px', marginTop: '30px' }}>
      Thanks,
      <br />
      The QuickDev Team
    </p>
  </div>
)

export default PaymentConfirmationEmail