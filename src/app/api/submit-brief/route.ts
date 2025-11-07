// src/app/api/submit-brief/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

export async function POST(request: Request) {
  try {
    // 1. Parse FormData instead of JSON
    const formData = await request.formData()

    const orderId = formData.get('orderId') as string
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    let formattedBrief = ''
    const fileUploads: { key: string; file: File }[] = []

    // 2. Separate text fields from file fields
    for (const [key, value] of formData.entries()) {
      if (key === 'orderId') continue

      if (value instanceof File) {
        // It's a file
        if (value.size > 0) {
          // Only add if a file was actually selected
          fileUploads.push({
            key: key,
            file: value,
          })
        }
      } else {
        // It's a text field
        formattedBrief += `${key}:\n${value}\n\n`
      }
    }

    // 3. Upload files to Sanity
    const sanityFileAssets = []

    for (const upload of fileUploads) {
      try {
        // Upload the file to Sanity's asset CDN
        const assetDoc = await sanityMutationClient.assets.upload(
          'file',
          upload.file, // Pass the File object directly
          {
            filename: upload.file.name,
            // --- THIS IS THE FIX ---
            // storeOriginalFilename is a schema-level option,
            // not a client-upload option. It was removed.
          }
        )

        // Add its reference to our array
        sanityFileAssets.push({
          _type: 'file',
          _key: upload.key, // Use field key for a stable React key
          asset: {
            _type: 'reference',
            _ref: assetDoc._id,
          },
        })

        // Add a note to the text brief that a file was uploaded
        formattedBrief += `${upload.key}:\n[File Uploaded: ${upload.file.name}]\n\n`
      } catch (uploadErr: any) {
        console.error(
          `Failed to upload file ${upload.file.name}:`,
          uploadErr.message
        )
        // Add a failure note to the text brief
        formattedBrief += `${upload.key}:\n[File Upload FAILED: ${upload.file.name}]\n\n`
      }
    }

    // 4. Patch the existing order document
    const patch = sanityMutationClient.patch(orderId)

    // Set the text brief
    patch.set({ projectBrief: formattedBrief })

    // If there are files, set them in the new 'briefFiles' array
    if (sanityFileAssets.length > 0) {
      patch.set({ briefFiles: sanityFileAssets })
    }

    // Commit all changes
    await patch.commit()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(`Error in /api/submit-brief: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}