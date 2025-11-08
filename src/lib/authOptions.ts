// src/lib/authOptions.ts
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import bcrypt from 'bcryptjs'

// Define the User type as it will be in Sanity
interface SanityUser {
  _id: string
  name: string
  email: string
  password?: string // This is the HASHED password
}

// 1. Define and EXPORT the authOptions
export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 1. Fetch user from Sanity by email
        const user: SanityUser | null = await sanityMutationClient.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: credentials.email }
        )

        if (!user) {
          return null
        }

        if (!user.password) {
          return null
        }

        // 2. Compare the provided password with the stored hash
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordsMatch) {
          return null
        }

        // 3. Return user object
        return {
          id: user._id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    // Attach user ID to the session token
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // Attach user ID to the session object
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}