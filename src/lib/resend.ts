// src/lib/resend.ts
import { Resend } from 'resend'
import { render } from '@react-email/render'
import * as React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)
const fromEmail = process.env.RESEND_FROM_EMAIL

interface EmailOptions {
  to: string
  subject: string
  react: React.ReactElement // This type is correct
}

/**
 * A reusable utility for sending transactional emails using Resend and React Email.
 */
export async function sendEmail({ to, subject, react }: EmailOptions) {
  if (!fromEmail) {
    console.error('Missing environment variable: RESEND_FROM_EMAIL')
    throw new Error('Server configuration error: Missing RESEND_FROM_EMAIL')
  }
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing environment variable: RESEND_API_KEY')
    throw new Error('Server configuration error: Missing RESEND_API_KEY')
  }

  try {
    // --- THIS IS THE FIX ---
    // We await the render function, as it may be async (especially with React 19)
    const html = await render(react)
    // -----------------------

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: html, // This now correctly receives a string
    })

    if (error) {
      console.error(`Resend error sending email to ${to}: ${error.message}`)
      throw error
    }

    console.log(`Successfully sent email to ${to}, ID: ${data?.id}`)
    return data
  } catch (error: any) {
    console.error(
      `Failed to send email to ${to} with subject "${subject}": ${error.message}`
    )
    throw error
  }
}