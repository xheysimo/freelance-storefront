// src/app/page.tsx
import { client } from "@/sanity/lib/client" // Use the client you already have
import { Key } from "react"
import Link from "next/link"

// 1. Define types for our Sanity data
interface Service {
  _id: Key
  title: string
  summary: string
  priceGBP: number
  priceSuffix: string
  ctaText: string
  stripePaymentLink?: string // This is for one-off payments
  // We'll handle stripePriceId for subscriptions later
}

// 2. Define the GROQ query
const getServices = async (): Promise<Service[]> => {
  // This query fetches all documents of type "service"
  const query = `*[_type == "service"]{
    _id,
    title,
    summary,
    priceGBP,
    priceSuffix,
    ctaText,
    stripePaymentLink
  }`

  const data = await client.fetch(query)
  return data
}

// 3. This is a Server Component, it fetches data before rendering
export default async function Home() {
  const services = await getServices()

  return (
    <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your Freelance Storefront
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          This is your new professional "shop front" to attract and convert clients.
        </p>
      </div>

      {/* Service Cards Section */}
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div 
            key={service._id} 
            className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg bg-white dark:bg-gray-900"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {service.title}
            </h2>
            <p className="mt-2 flex-1 text-gray-600 dark:text-gray-400">
              {service.summary}
            </p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                £{service.priceGBP}
              </span>
              <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                {service.priceSuffix}
              </span>
            </div>

            {/* We'll add payment logic here in the next step */}
            <Link
              href={service.stripePaymentLink || '#'}
              className="mt-8 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              {service.ctaText}
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}