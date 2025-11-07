// src/app/book/success/page.tsx
import Link from 'next/link'

export default function BookingSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Thank You!
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Your subscription is all set up.
      </p>
      <p className="mt-2 text-gray-500">
        You will receive a confirmation email shortly.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Back to Homepage
      </Link>
    </main>
  )
}