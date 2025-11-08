// src/components/auth/SignOutButton.tsx
'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="rounded-md bg-gray-200 dark:bg-gray-800 px-3.5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700"
    >
      Sign Out
    </button>
  )
}