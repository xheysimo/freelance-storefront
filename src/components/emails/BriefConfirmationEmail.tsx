// src/components/emails/BriefConfirmationEmail.tsx
import * as React from 'react'

interface EmailProps {
  name: string
  orderId: string
}

/**
 * Email template for confirming a project brief submission.
 */
export const BriefConfirmationEmail: React.FC<Readonly<EmailProps>> = ({
  name,
  orderId,
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
      We have successfully received the project brief for your order (
      <strong>{orderId}</strong>).
    </p>
    <p style={{ color: '#555', fontSize: '16px' }}>
      We will review the details and get started shortly. You can monitor the
      project status from your account dashboard.
    </p>
    <p style={{ color: '#777', fontSize: '14px', marginTop: '30px' }}>
      Thanks,
      <br />
      The QuickDev Team
    </p>
  </div>
)

export default BriefConfirmationEmail