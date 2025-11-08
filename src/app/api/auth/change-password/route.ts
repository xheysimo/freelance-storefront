// src/app/api/auth/change-password/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 })
    }

    // 1. Fetch user (including their password) from Sanity
    const user = await sanityMutationClient.fetch(
      `*[_type == "user" && email == $email][0]{
        _id,
        password
      }`,
      { email: session.user.email }
    )

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 2. Verify the current password
    const passwordsMatch = await bcrypt.compare(
      currentPassword,
      user.password
    )

    if (!passwordsMatch) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 403 })
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // 4. Update the user's password in Sanity
    await sanityMutationClient
      .patch(user._id)
      .set({
        password: hashedPassword,
      })
      .commit()

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 })

  } catch (err: any) {
    console.error('Change Password Error:', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}