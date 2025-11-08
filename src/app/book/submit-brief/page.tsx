// src/app/book/submit-brief/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { getBriefDataForOrder } from './actions'
import ProjectBriefForm from '@/components/checkout/ProjectBriefForm'

// Define the shape of the brief data
interface ProjectBrief {
  title: string
  fields: any[]
}

function SubmitBriefContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [briefData, setBriefData] = useState<ProjectBrief | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('No Order ID provided in URL.')
      setIsLoading(false)
      return
    }

    // Call the server action to get the data
    getBriefDataForOrder(orderId)
      .then((result) => {
        if (result.error) {
          setError(result.error)
        } else {
          setBriefData(result.briefData)
        }
      })
      .catch((err) => {
        setError(err.message || 'An unknown error occurred.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [orderId])

  if (isLoading) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Loading Project Brief...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
          Error Loading Brief
        </h2>
        <p className="mt-2 text-gray-500">{error}</p>
      </div>
    )
  }

  if (briefData && orderId) {
    // We already have this component, it just needs the data!
    return (
      <ProjectBriefForm briefData={briefData} orderId={orderId} />
    )
  }

  return null // Fallback
}

// Main page component
export default function SubmitBriefPage() {
  return (
    <main className="w-full py-20 sm:py-24 bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
      <div className="w-full max-w-lg p-8 bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <Suspense
          fallback={
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
          }
        >
          <SubmitBriefContent />
        </Suspense>
      </div>
    </main>
  )
}