// src/app/login/page.tsx
'use client'

import { useState, FormEvent, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/account')
    }
  }, [status, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
    })

    setIsLoading(false)

    if (result?.ok) {
      router.push('/account')
    } else {
      setError(result?.error || 'Invalid email or password. Please try again.')
    }
  }

  if (status === 'authenticated') {
    return (
      <main className="w-full py-20 sm:py-24 bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="w-full max-w-md p-8 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300">Redirecting to your account...</p>
        </div>
      </main>
    )
  }
  
  return (
    <main className="w-full py-20 sm:py-24 bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm p-3"
            />
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}