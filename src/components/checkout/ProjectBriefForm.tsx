// src/components/checkout/ProjectBriefForm.tsx
'use client'

import { FormEvent, useState } from 'react'

// Define the shape of the form field data from Sanity
interface FormField {
  _key: string
  label: string
  name: { current: string }
  fieldType: 'text' | 'textarea' | 'email' | 'file' // <-- ADD 'file'
  placeholder?: string
  required?: boolean
}

// (Props type is unchanged)
type ProjectBriefFormProps = {
  briefData: {
    title: string
    fields: FormField[]
  }
  orderId: string
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
    
    formData.append('orderId', orderId)
    
    try {
      const response = await fetch('/api/submit-brief', {
        method: 'POST',
        body: formData,
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
              ) : field.fieldType === 'file' ? (
                <input
                  id={field.name.current}
                  name={field.name.current}
                  type="file"
                  required={field.required}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 dark:text-gray-400 dark:file:bg-indigo-900 dark:file:text-indigo-300 dark:hover:file:bg-indigo-800"
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