// src/types/next-auth.d.ts
import 'next-auth'
import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback */
  interface JWT extends DefaultJWT {
    id: string
  }
}

declare module 'next-auth' {
  /** Returned by the `session` callback */
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }

  /** The user object returned by the `authorize` callback */
  interface User extends DefaultUser {
    id: string
  }
}