// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import crypto from 'crypto'
import { Resend } from 'resend'
import ResetPasswordEmail from '@/components/auth/ResetPasswordEmail'
import * as React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

const fromEmail = process.env.RESEND_FROM_EMAIL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

if (!fromEmail) {
  console.error('Missing RESEND_FROM_EMAIL environment variable')
}
if (!siteUrl) {
  console.error('Missing NEXT_PUBLIC_SITE_URL environment variable')
}


export async function POST(request: Request) {
  if (!fromEmail || !siteUrl) {
    console.error('Auth API route missing required environment variables.')
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 })
  }

  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 1. Find the user by email
    const user = await sanityMutationClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    )

    if (!user) {
      return NextResponse.json({ message: 'If a user with this email exists, a reset link has been sent.' })
    }

    // 2. Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // 3. Set an expiry date (1 hour from now)
    const expires = new Date(Date.now() + 3600000).toISOString()

    // 4. Update the user in Sanity
    await sanityMutationClient
      .patch(user._id)
      .set({
        passwordResetToken: hashedResetToken,
        passwordResetExpires: expires,
      })
      .commit()

    // 5. Send the email
    
    const resetUrl = `${siteUrl}/reset-password?token=${resetToken}`
    
    try {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: 'Reset your password',
        react: ResetPasswordEmail({
          name: user.name || 'User',
          resetUrl: resetUrl,
        }) as React.ReactElement, 
      });
    } catch (emailError: any) {
      console.error("Email sending error:", emailError);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'If a user with this email exists, a reset link has been sent.' })

  } catch (err: any) {
    console.error('Forgot Password API Error:', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}