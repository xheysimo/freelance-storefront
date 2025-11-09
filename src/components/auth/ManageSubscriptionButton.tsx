// src/components/auth/ManageSubscriptionButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleClick = async () => {
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
      })
      
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      router.push(data.url)

    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Manage My Subscription'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}