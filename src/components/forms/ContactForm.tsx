// src/components/forms/ContactForm.tsx
'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!name || !email || !message) {
      setError('Please fill out all fields.')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess('Message sent successfully! I will be in touch soon.')
      // Clear the form
      setName('')
      setEmail('')
      setMessage('')
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred. Please try again.')
    }

    setIsLoading(false)
  }

  // If successfully submitted, show a thank you message
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

  // Otherwise, show the form
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your Name
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm"
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm"
          />
        </div>
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Message
        </label>
        <div className="mt-1">
          <textarea
            id="message"
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, I'd like to talk about..."
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm"
          />
        </div>
      </div>

      {/* Submit Button & Messages */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Message'}
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