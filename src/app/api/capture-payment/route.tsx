// src/app/api/capture-payment/route.tsx
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import Stripe from 'stripe'

import { sendEmail } from '@/lib/resend'
import { PaymentConfirmationEmail } from '@/components/emails/PaymentConfirmationEmail'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!

interface OrderDetails {
  customerEmail: string
  customerName: string
  serviceName: string
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${SANITY_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentIntentId, orderId: rawOrderId } = await request.json()

    if (!paymentIntentId || !rawOrderId) {
      return NextResponse.json(
        { error: 'Missing paymentIntentId or orderId' },
        { status: 400 }
      )
    }

    const orderId = rawOrderId.replace(/^drafts\./, '')
    
    let order: OrderDetails | null = null
    try {
      const query = `*[_type == "order" && _id == $orderId][0]{
        customerEmail, 
        customerName,
        "serviceName": service->title
      }`
      const params = { orderId }
      order = await sanityMutationClient.fetch<OrderDetails>(query, params)
    } catch (fetchErr: any) {
      console.error(
        `Failed to fetch order ${orderId} for email:`,
        fetchErr.message
      )
    }

    await stripe.paymentIntents.capture(paymentIntentId)

    await sanityMutationClient
      .patch(orderId)
      .set({ oneOffStatus: 'paid' })
      .commit()

    if (order?.customerEmail) {
      try {
        await sendEmail({
          to: order.customerEmail,
          subject: 'Payment Successful: Your Order is Complete!',
          react: (
            <PaymentConfirmationEmail
              name={order.customerName || 'Valued Customer'}
              orderId={orderId}
              serviceName={order.serviceName || 'your service'}
            />
          ),
        })
        console.log(`✅ Sent payment capture email for order ${orderId}`)
      } catch (emailErr: any) {
        console.warn(
          `⚠️ Failed to send payment email for ${orderId}:`,
          emailErr.message
        )
      }
    } else {
      console.warn(
        `⚠️ No customer email for order ${orderId}. Skipping payment email.`
      )
    }

    return NextResponse.json({ success: true, status: 'paid' })
  } catch (err: any) { 
    if (err.code === 'payment_intent_unexpected_state') {
      if (err.message.includes('already been captured')) {
        const { orderId: rawOrderId } = await request.json()
        const orderId = rawOrderId.replace(/^drafts\./, '')
        
        await sanityMutationClient
          .patch(orderId)
          .set({ oneOffStatus: 'paid' })
          .commit()
        return NextResponse.json({
          success: true,
          status: 'paid',
          message: 'Already captured',
        })
      }
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}