// src/app/api/authorize/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next' // 1. Import next-auth
import { authOptions } from '@/lib/authOptions'
import { sanityMutationClient } from '@/sanity/lib/mutationClient' // 2. Import Sanity client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { amount, email, name } = await request.json()

    if (!amount || !email || !name) {
      return NextResponse.json({ error: 'Missing amount, email, or name' }, { status: 400 })
    }

    // 3. Get the server-side session
    const session = await getServerSession(authOptions)
    
    let customer: Stripe.Customer | undefined;

    // 4. LOGIC: Determine which customer to use
    if (session?.user?.email) {
      // --- USER IS LOGGED IN ---
      // Fetch their Stripe ID from Sanity
      const user = await sanityMutationClient.fetch(
        `*[_type == "user" && email == $email][0]{ stripeCustomerId }`,
        { email: session.user.email }
      )
      
      if (user?.stripeCustomerId) {
        // User exists, retrieve their Stripe customer profile
        customer = await stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
      }
    }
    
    // 5. --- USER IS A GUEST (or logged-in user had no ID) ---
    if (!customer) {
      // Find a Stripe Customer by email
      const customerList = await stripe.customers.list({ email: email, limit: 1 });
      
      if (customerList.data.length > 0) {
        // Customer exists, update their name
        customer = await stripe.customers.update(customerList.data[0].id, {
          name: name,
        });
      } else {
        // Customer does NOT exist, create them
        customer = await stripe.customers.create({ 
          email: email, 
          name: name 
        });
      }
    }
    // --- End of customer logic ---

    // 6. Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      capture_method: 'manual',
      customer: customer.id, // <-- Link to the correct customer
    })

    // 7. Return the client_secret AND the id
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}