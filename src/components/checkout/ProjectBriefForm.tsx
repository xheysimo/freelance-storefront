// src/components/checkout/ProjectBriefForm.tsx
'use client'

import { FormEvent, useState } from 'react'

// Define the shape of the form field data from Sanity
interface FormField {
  _key: string
  label: string
  name: { current: string }
  fieldType: 'text' | 'textarea' | 'email'
  placeholder?: string
  required?: boolean
}

// 1. Update prop type to accept orderId
type ProjectBriefFormProps = {
  briefData: {
    title: string
    fields: FormField[]
    // formspreeEndpoint is no longer used
  }
  orderId: string // <-- 1. Get the orderId
}

export default function ProjectBriefForm({ briefData, orderId }: ProjectBriefFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    const formData = new FormData(event.currentTarget)
    // Convert FormData to a plain object
    const briefData = Object.fromEntries(formData.entries());
    
    try {
      // 2. Submit to YOUR new endpoint
      const response = await fetch('/api/submit-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderId: orderId, // <-- 3. Send the orderId
          briefData: briefData  // <-- 4. Send the form data object
        }),
      })
      
      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const { error } = await response.json()
        setError(`There was an error: ${error}`)
      }
    } catch (err) {
      setError('An unknown error occurred. Please check your connection.')
    }
    
    setIsSubmitting(false)
  }

  // If submitted, show success message
  if (isSubmitted) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Thank You!
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your project brief has been submitted. I'll be in touch shortly!
        </p>
      </div>
    )
  }

  // Otherwise, show the form
  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
        {briefData.title || 'Project Brief'}
      </h3>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Please fill out the details below so I can get started on your project.
      </p>
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {briefData.fields.map((field) => (
          <div key={field._key}>
            <label
              htmlFor={field.name.current}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label}
              {field.required && ' *'}
            </label>
            <div className="mt-1">
              {field.fieldType === 'textarea' ? (
                <textarea
                  id={field.name.current}
                  name={field.name.current}
                  rows={4}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm"
                />
              ) : (
                <input
                  id={field.name.current}
                  name={field.name.current}
                  type={field.fieldType}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm"
                />
              )}
            </div>
          </div>
        ))}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project Brief'}
          </button>
        </div>
        {error && (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}