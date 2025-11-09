// src/lib/authOptions.ts
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { sanityMutationClient } from '@/sanity/lib/mutationClient'
import bcrypt from 'bcryptjs'

interface SanityUser {
  _id: string
  name: string
  email: string
  password?: string
}

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

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordsMatch) {
          return null
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}