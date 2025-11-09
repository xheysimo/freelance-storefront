// src/app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const fromEmail = process.env.RESEND_FROM_EMAIL
const toEmail = process.env.MY_PERSONAL_EMAIL

export async function POST(request: Request) {
  try {
    if (!fromEmail || !toEmail) {
      console.error(
        'Missing environment variables: RESEND_FROM_EMAIL or MY_PERSONAL_EMAIL'
      )
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      )
    }

    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `New Contact Form Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(`Error in /api/contact: ${err.message}`)
    if (err.name === 'resend_error') {
      return NextResponse.json(
        { error: `Email failed to send: ${err.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'An unknown error occurred.' },
      { status: 500 }
    )
  }
}