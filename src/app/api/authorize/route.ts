// src/app/api/authorize/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { amount, email, name } = await request.json()

    if (!amount || !email || !name) {
      return NextResponse.json({ error: 'Missing amount, email, or name' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    
    let customer: Stripe.Customer | undefined;

    if (session?.user?.email) {
      const user = await sanityMutationClient.fetch(
        `*[_type == "user" && email == $email][0]{ stripeCustomerId }`,
        { email: session.user.email }
      )
      
      if (user?.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
      }
    }
    
    if (!customer) {
      const customerList = await stripe.customers.list({ email: email, limit: 1 });
      
      if (customerList.data.length > 0) {
        customer = await stripe.customers.update(customerList.data[0].id, {
          name: name,
        });
      } else {
        customer = await stripe.customers.create({ 
          email: email, 
          name: name 
        });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      capture_method: 'manual',
      customer: customer.id,
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}