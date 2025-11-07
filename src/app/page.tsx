// src/app/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import { Key } from "react"
import Link from "next/link"
import Testimonials, { Testimonial } from "@/components/testimonials/Testimonials"

interface Service {
  _id: Key
  title: string
  summary: string
  priceGBP: number
  priceSuffix: string
  ctaText: string
  slug: string
}

// Define the GROQ queries
const SERVICES_QUERY = `*[_type == "service"]{
    _id,
    title,
    summary,
    priceGBP,
    priceSuffix,
    ctaText,
    "slug": slug.current
  }`

const TESTIMONIALS_QUERY = `*[_type == "testimonial"]{
  _id,
  authorName,
  authorTitle,
  authorImage,
  quote
}`

// --- FIX 1: Use <any> and cast back ---
async function getPageData() {
  const [servicesResult, testimonialsResult] = await Promise.all([
    sanityFetch<any>({ query: SERVICES_QUERY }), // Fetch as any
    sanityFetch<any>({ query: TESTIMONIALS_QUERY }), // Fetch as any
  ])
  return {
    // Cast back to the correct types
    services: servicesResult.data as Service[],
    testimonials: testimonialsResult.data as Testimonial[],
  }
}
// --- END OF FIX 1 ---

export default async function Home() {
  const { services, testimonials } = await getPageData()

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center p-12 lg:p-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your Freelance Storefront
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          This is your new professional "shop front" to attract and convert clients.
        </p>
      </div>

      {/* Services Section */}
      <div className="w-full max-w-5xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* --- FIX 2: Add 'Service' type to the map parameter --- */}
          {services.map((service: Service) => (
          // --- END OF FIX 2 ---
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
              
              <Link
                href={`/book/${service.slug}`}
                className="mt-8 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                {service.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Render the new Testimonials component */}
      <Testimonials testimonials={testimonials} />
    </main>
  )
}