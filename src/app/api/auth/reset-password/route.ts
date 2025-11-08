// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
    }

    // 1. Hash the token from the URL/body
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // 2. Find the user by the hashed token and check expiry
    const user = await sanityMutationClient.fetch(
      `*[_type == "user" && 
         passwordResetToken == $hashedToken && 
         passwordResetExpires > now()][0]`,
      { hashedToken }
    )

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired password reset token.' }, { status: 400 })
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // 4. Update the user's password and clear the reset token fields
    await sanityMutationClient
      .patch(user._id)
      .set({
        password: hashedPassword,
      })
      .unset(['passwordResetToken', 'passwordResetExpires']) // Clear the tokens
      .commit()

    return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 })

  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}