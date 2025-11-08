// src/components/auth/ResetPasswordEmail.tsx
import * as React from 'react';

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export const ResetPasswordEmail: React.FC<Readonly<ResetPasswordEmailProps>> = ({
  name,
  resetUrl,
}) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
    <h1 style={{ color: '#333' }}>Hi {name},</h1>
    <p style={{ color: '#555', fontSize: '16px' }}>
      Someone requested a password reset for your account. If this was you,
      click the button below to set a new password.
    </p>
    <a
      href={resetUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        padding: '12px 20px',
        margin: '20px 0',
        color: '#fff',
        backgroundColor: '#4f46e5', // Indigo color
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
    >
      Reset Your Password
    </a>
    <p style={{ color: '#555', fontSize: '16px' }}>
      This link will expire in 1 hour.
    </p>
    <p style={{ color: '#777', fontSize: '14px' }}>
      If you didn&apos;t request this, you can safely ignore this email.
    </p>
  </div>
);

export default ResetPasswordEmail;