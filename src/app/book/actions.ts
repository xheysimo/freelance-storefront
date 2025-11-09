// src/app/book/actions.ts
'use server'

import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'

interface ProjectBrief {
  title: string
  fields: any[]
}

interface OrderCreationResult {
  orderId: string | null
  projectBrief: ProjectBrief | null
  error?: string 
}

export async function createSubscriptionOrder(
  sessionId: string,
  slug: string
): Promise<OrderCreationResult> {
  if (!sessionId || !slug) {
    throw new Error('Missing session_id or service slug.')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    })

    if (!session || !session.subscription || !session.customer_details || !session.customer) {
      throw new Error('Could not retrieve complete session details.')
    }

    const subscriptionId = session.subscription as string
    const stripeCustomerId = session.customer as string

    // 1. Check if an order with this subscription ID already exists
    const existingOrder = await sanityMutationClient.fetch<any>(
      `*[_type == "order" && stripeSubscriptionId == $subscriptionId][0]{ 
        _id,
        service->{ 
          projectBrief->{
            title,
            fields
          }
        } 
      }`,
      { subscriptionId: subscriptionId }
    )

    // 2. If it exists, return the existing orderId and brief
    if (existingOrder) {
      console.log(`Found existing order: ${existingOrder._id}`)
      return {
        orderId: existingOrder._id,
        projectBrief: existingOrder.service?.projectBrief || null,
      }
    }

    // 3. If no existing order, fetch the service
    const service = await sanityMutationClient.fetch<any>(
      `*[_type == "service" && slug.current == $slug][0]{ 
        _id,
        title,
        projectBrief->{ 
          title,
          fields
        } 
      }`,
      { slug: slug }
    )

    if (!service) {
      throw new Error(`Could not find service with slug: ${slug}`)
    }

    // 4. Create the Sanity Order
    const doc = {
      _type: 'order',
      service: {
        _type: 'reference',
        _ref: service._id,
      },
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: stripeCustomerId,
      subscriptionStatus: 'inProgress',
      customerName: session.customer_details.name || 'N/A',
      customerEmail: session.customer_details.email || 'N/A',
      projectBrief: service.projectBrief
        ? 'Pending submission...'
        : 'N/A - Recurring Subscription',
    }

    const newOrder = await sanityMutationClient.create(doc)
    console.log(
      `Successfully created order ${newOrder._id} for subscription: ${subscriptionId}`
    )

    return {
      orderId: newOrder._id,
      projectBrief: service.projectBrief || null,
    }
  } catch (err: any) {
    console.error(`Error in createSubscriptionOrder: ${err.message}`)
    return { orderId: null, projectBrief: null, error: err.message }
  }
}