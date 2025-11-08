// src/app/api/submit-quote/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    let formattedBrief = ''
    const fileUploads: { key: string; file: File }[] = []
    let customerName = ''
    let customerEmail = ''

    // 1. Separate text fields, files, and key customer info
    for (const [key, value] of formData.entries()) {
      if (key === 'name') {
        customerName = value as string
        formattedBrief += `Name:\n${value}\n\n`
      } else if (key === 'email') {
        customerEmail = value as string
        formattedBrief += `Email:\n${value}\n\n`
      } else if (value instanceof File) {
        if (value.size > 0) {
          fileUploads.push({ key: key, file: value })
        }
      } else {
        // All other text fields
        formattedBrief += `${key}:\n${value}\n\n`
      }
    }

    // 2. Upload files to Sanity
    const sanityFileAssets = []
    for (const upload of fileUploads) {
      try {
        const assetDoc = await sanityMutationClient.assets.upload(
          'file',
          upload.file,
          { filename: upload.file.name }
        )
        
        sanityFileAssets.push({
          _type: 'file',
          _key: assetDoc._id, // Use a unique key
          asset: {
            _type: 'reference',
            _ref: assetDoc._id,
          },
        })
        
        formattedBrief += `${upload.key}:\n[File Uploaded: ${upload.file.name}]\n\n`
      } catch (uploadErr: any) {
        console.error(`Failed to upload file ${upload.file.name}:`, uploadErr.message)
        formattedBrief += `${upload.key}:\n[File Upload FAILED: ${upload.file.name}]\n\n`
      }
    }

    // 3. Create the new quote document
    const doc = {
      _type: 'quote',
      status: 'new',
      customerName: customerName || 'N/A',
      customerEmail: customerEmail || 'N/A',
      projectBrief: formattedBrief.trim(),
      briefFiles: sanityFileAssets.length > 0 ? sanityFileAssets : undefined,
    }

    await sanityMutationClient.create(doc)

    // 4. Also send the notification email (like your contact form does)
    // We can re-use the /api/contact logic here for efficiency
    await fetch(new URL('/api/contact', request.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: customerName,
        email: customerEmail,
        message: `--- NEW QUOTE SUBMISSION ---\n\n${formattedBrief}`,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(`Error in /api/submit-quote: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}