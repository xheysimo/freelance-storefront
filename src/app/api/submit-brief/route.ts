// src/app/api/submit-brief/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'

export async function POST(request: Request) {
  try {
    const { orderId, briefData } = await request.json()

    if (!orderId || !briefData) {
      return NextResponse.json({ error: 'Missing orderId or briefData' }, { status: 400 })
    }

    // Format the brief data into a readable string
    let formattedBrief = ''
    for (const [key, value] of Object.entries(briefData)) {
      formattedBrief += `${key}:\n${value}\n\n`
    }

    // Patch the existing order document
    await sanityMutationClient
      .patch(orderId)
      .set({ projectBrief: formattedBrief })
      .commit()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}