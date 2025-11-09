// src/components/forms/QuoteForm.tsx
'use client'

import { useState } from 'react'

export default function QuoteForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(event.currentTarget)
    
    if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
      setError('Please fill out all required fields.')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/submit-quote', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess('Quote request sent successfully! I will be in touch soon.')
      event.currentTarget.reset()
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred. Please try again.')
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Thank You!
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your Name *
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your Email *
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Project Details *
        </label>
        <div className="mt-1">
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Hi, I'd like to talk about..."
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm"
          />
        </div>
      </div>
      
      <div>
        <label
          htmlFor="file-upload"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Attach Files (Optional)
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          You can attach mockups, documents, or screenshots.
        </p>
        <div className="mt-1">
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 dark:text-gray-400 dark:file:bg-indigo-900 dark:file:text-indigo-300 dark:hover:file:bg-indigo-800"
          />
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Quote Request'}
        </button>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}