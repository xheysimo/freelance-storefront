// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
// 1. Import authOptions from the new file
import { authOptions } from '@/lib/authOptions'

// 2. Create the handler using the imported options
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }