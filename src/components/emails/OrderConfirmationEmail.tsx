// src/components/emails/OrderConfirmationEmail.tsx
import * as React from 'react'

interface EmailProps {
  name: string
  orderId: string
  serviceName: string
}

/**
 * Email template for confirming a new order (both one-off and subscription).
 */
export const OrderConfirmationEmail: React.FC<Readonly<EmailProps>> = ({
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
      Thank you for your order! We've successfully received it and are ready to
      get started.
    </p>
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f4f4f5',
        borderRadius: '5px',
        border: '1px solid #e2e8f0',
        marginTop: '20px',
        marginBottom: '20px',
      }}
    >
      <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
        <strong>Service:</strong> {serviceName}
      </p>
      <p style={{ margin: '0', fontSize: '16px' }}>
        <strong>Order ID:</strong> {orderId}
      </p>
    </div>
    <p style={{ color: '#555', fontSize: '16px' }}>
      You can track the status of your order at any time by logging into your
      account dashboard.
    </p>
    <p style={{ color: '#777', fontSize: '14px', marginTop: '30px' }}>
      Thanks,
      <br />
      The QuickDev Team
    </p>
  </div>
)

export default OrderConfirmationEmail