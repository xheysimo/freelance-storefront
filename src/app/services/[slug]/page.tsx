// src/app/services/[slug]/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import PortableTextComponent from "@/components/sanity/PortableText"
import Link from "next/link"
import { CheckIcon } from "@heroicons/react/24/outline"
import Portfolio, { Project } from "@/components/portfolio/Portfolio"
import Testimonials, { Testimonial } from "@/components/testimonials/Testimonials"

// Define types
interface Feature {
  _key: string
  title: string
  description: string
}

interface ProjectWithTestimonial extends Project {
  testimonial?: Testimonial
}

interface Service {
  _id: string
  title: string
  summary: string // <-- 1. Added summary
  priceGBP: number
  priceSuffix: string
  details: any
  benefits: Feature[]
  ctaText: string
  slug: string
  seo: {
    metaTitle: string
    metaDescription: string
  }
  relatedProjects: ProjectWithTestimonial[]
}

// 2. Update the query to fetch the 'summary'
const SERVICE_QUERY = `*[_type == "service" && slug.current == $slug][0]{
  _id,
  title,
  summary, // <-- Fetched summary
  priceGBP,
  priceSuffix,
  details,
  benefits,
  ctaText,
  "slug": slug.current,
  seo,
  "relatedProjects": *[_type == "project" && references(^._id)]{
    _id,
    title,
    clientName,
    coverImage,
    summary,
    liveUrl,
    githubUrl,
    "slug": slug.current,
    testimonial->{
      _id,
      authorName,
      authorTitle,
      authorImage,
      quote
    }
  }
}`

// Generate metadata (unchanged, but needs resolvedParams)
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const resolvedParams = await params
  const result = await sanityFetch<any>({
    query: SERVICE_QUERY,
    params: { slug: resolvedParams.slug },
  })
  
  const service = result.data as Service | null
  if (!service) {
    return {}
  }
  return {
    title: service.seo.metaTitle,
    description: service.seo.metaDescription,
  }
}

// 4. The NEW page component
export default async function ServicePage({
  params,
}: {
  params: { slug: string }
}) {
  const resolvedParams = await params
  const result = await sanityFetch<any>({
    query: SERVICE_QUERY,
    params: { slug: resolvedParams.slug },
  })
  
  const service = result.data as Service | null

  if (!service) {
    notFound()
  }

  const relatedTestimonials =
    service.relatedProjects
      ?.map((project) => project.testimonial)
      .filter((testimonial): testimonial is Testimonial => !!testimonial) || []

  return (
    <main className="flex min-h-screen flex-col">
      {/* 1. Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            {service.summary}
          </p>
        </div>
      </section>

      {/* 2. Main Content - Two Column Layout */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          
          {/* 2a. Left Column (Main Content) */}
          <article className="lg:col-span-2 prose prose-lg dark:prose-invert">
            {/* Render Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <>
                <h2>What's Included?</h2>
                <ul className="not-prose list-none p-0">
                  {service.benefits.map((benefit) => (
                    <li key={benefit._key} className="flex gap-4 mb-4">
                      <CheckIcon className="h-6 w-6 text-indigo-500 flex-shrink-0" />
                      <div>
                        <strong className="block">{benefit.title}</strong>
                        <span className="text-gray-600 dark:text-gray-400">
                          {benefit.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Render Full Details */}
            {service.details && (
              <>
                <h2>Full Details</h2>
                <PortableTextComponent value={service.details} />
              </>
            )}
          </article>

          {/* 2b. Right Column (Sticky Booking Card) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg bg-white dark:bg-gray-900">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                £{service.priceGBP}
              </span>
              <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                {service.priceSuffix}
              </span>
              
              <Link
                href={`/book/${service.slug}`}
                className="mt-8 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                {service.ctaText}
              </Link>
              <p className="mt-4 text-xs text-center text-gray-500">
                Card authorized, not charged until completion.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* 3. Related Projects (Full Width) */}
      {service.relatedProjects && service.relatedProjects.length > 0 && (
        <Portfolio
          projects={service.relatedProjects}
          title="Case Studies For This Service" // <-- Passing the new title
        />
      )}

      {/* 4. Related Testimonials (Full Width) */}
      {relatedTestimonials.length > 0 && (
        <Testimonials
          testimonials={relatedTestimonials}
          title="Kind Words From Happy Clients" // <-- Passing the new title
        />
      )}
    </main>
  )
}