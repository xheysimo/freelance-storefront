// src/app/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import { Key } from "react"
import Link from "next/link"
import Testimonials, { Testimonial } from "@/components/testimonials/Testimonials"
import Portfolio, { Project } from "@/components/portfolio/Portfolio" // <-- 1. Import new component

interface Service {
  _id: Key
  title: string
  summary: string
  priceGBP: number
  priceSuffix: string
  ctaText: string
  slug: string
}

// 2. Define the GROQ query for projects
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

const PROJECTS_QUERY = `*[_type == "project"]{
  _id,
  title,
  clientName,
  coverImage,
  summary,
  liveUrl,
  githubUrl,
  "slug": slug.current
}` //

// 3. Fetch all data in parallel
async function getPageData() {
  const [servicesResult, testimonialsResult, projectsResult] = await Promise.all([
    sanityFetch<any>({ query: SERVICES_QUERY }),
    sanityFetch<any>({ query: TESTIMONIALS_QUERY }),
    sanityFetch<any>({ query: PROJECTS_QUERY }), // <-- 4. Add project fetch
  ])
  return {
    services: servicesResult.data as Service[],
    testimonials: testimonialsResult.data as Testimonial[],
    projects: projectsResult.data as Project[], // <-- 5. Return projects
  }
}

export default async function Home() {
  // 6. Get all data, including projects
  const { services, testimonials, projects } = await getPageData()

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
      <div id="services" className="w-full max-w-5xl px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
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
                href={`/services/${service.slug}`} // <-- NEW LINK
                className="mt-8 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                {service.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* 7. Render the new Portfolio component */}
      <div id="portfolio" className="w-full"> {/* <-- Added this wrapper */}
          <Portfolio projects={projects} />
      </div>

      {/* Render the Testimonials component */}
      <Testimonials testimonials={testimonials} />
    </main>
  )
}