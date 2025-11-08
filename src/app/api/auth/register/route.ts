// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import bcrypt from 'bcryptjs'
import Stripe from 'stripe' // <-- Import Stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!) // <-- Init Stripe

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Check if user already exists
    const existingUser = await sanityMutationClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    )

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    // ---!! NEW LOGIC: CREATE STRIPE CUSTOMER !! ---
    let stripeCustomerId: string
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      })
      stripeCustomerId = customer.id
    } catch (stripeError: any) {
      console.error("Stripe customer creation failed:", stripeError.message)
      return NextResponse.json({ error: 'Failed to create payment profile.' }, { status: 500 })
    }
    // ---!! END NEW LOGIC !! ---


    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // 3. Create the new user in Sanity
    const doc = {
      _type: 'user',
      name: name,
      email: email,
      password: hashedPassword,
      stripeCustomerId: stripeCustomerId, // <-- Save the new ID
    }

    await sanityMutationClient.create(doc)

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })

  } catch (err: any) {
    console.error('Registration Error:', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}