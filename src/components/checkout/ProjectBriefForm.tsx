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

// 1. Update prop type to include the endpoint
type ProjectBriefFormProps = {
  briefData: {
    title: string
    fields: FormField[]
    formspreeEndpoint: string // <-- It's now part of this prop
  }
}

export default function ProjectBriefForm({ briefData }: ProjectBriefFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  // 2. Use the endpoint from the prop
  const FORMSPREE_ENDPOINT = briefData.formspreeEndpoint

  // 3. Check if the endpoint was provided from Sanity
  if (!FORMSPREE_ENDPOINT) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        Form endpoint is not configured for this service. Please contact support.
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    const formData = new FormData(event.currentTarget)
    
    try {
      // 4. Submit to the dynamic endpoint
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })
      
      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError('There was an error submitting your form. Please try again.')
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