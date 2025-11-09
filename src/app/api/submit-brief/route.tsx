// src/app/api/submit-brief/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

import { sendEmail } from '@/lib/resend'
import { BriefConfirmationEmail } from '@/components/emails/BriefConfirmationEmail'

interface OrderCustomerData {
  customerEmail: string
  customerName: string
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    let order: OrderCustomerData | null = null
    try {
      const query =
        '*[_type == "order" && _id == $orderId][0]{ customerEmail, customerName }'
      const params = { orderId }
      order = await sanityMutationClient.fetch<OrderCustomerData>(query, params)
    } catch (fetchErr: any) {
      console.error(
        `Failed to fetch order ${orderId} for email:`,
        fetchErr.message
      )
    }

    let formattedBrief = ''
    const fileUploads: { key: string; file: File }[] = []

    for (const [key, value] of formData.entries()) {
      if (key === 'orderId') continue

      if (value instanceof File) {
        if (value.size > 0) {
          fileUploads.push({
            key: key,
            file: value,
          })
        }
      } else {
        const fieldLabel = key.replace(/_/g, ' ')
        formattedBrief += `${
          fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)
        }:\n${value}\n\n`
      }
    }

    const sanityFileAssets = []
    for (const upload of fileUploads) {
      try {
        const assetDoc = await sanityMutationClient.assets.upload(
          'file',
          upload.file,
          {
            filename: upload.file.name,
          }
        )

        sanityFileAssets.push({
          _type: 'file',
          _key: upload.key,
          asset: {
            _type: 'reference',
            _ref: assetDoc._id,
          },
        })

        const fieldLabel = upload.key.replace(/_/g, ' ')
        formattedBrief += `${
          fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)
        }:\n[File Uploaded: ${upload.file.name}]\n\n`
      } catch (uploadErr: any) {
        console.error(
          `Failed to upload file ${upload.file.name}:`,
          uploadErr.message
        )
        const fieldLabel = upload.key.replace(/_/g, ' ')
        formattedBrief += `${
          fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)
        }:\n[File Upload FAILED: ${upload.file.name}]\n\n`
      }
    }

    const patch = sanityMutationClient.patch(orderId)
    patch.set({ projectBrief: formattedBrief.trim() })
    if (sanityFileAssets.length > 0) {
      patch.set({ briefFiles: sanityFileAssets })
    }
    await patch.commit()

    if (order?.customerEmail) {
      try {
        await sendEmail({
          to: order.customerEmail,
          subject: 'We received your project brief!',
          react: (
            <BriefConfirmationEmail
              name={order.customerName || 'Valued Customer'}
              orderId={orderId}
            />
          ),
        })
        console.log(`✅ Sent brief confirmation email for order ${orderId}`)
      } catch (emailErr: any) {
        console.warn(
          `⚠️ Failed to send brief email for ${orderId}:`,
          emailErr.message
        )
      }
    } else {
      console.warn(
        `⚠️ No customer email found for order ${orderId}. Skipping brief email.`
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(`Error in /api/submit-brief: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}