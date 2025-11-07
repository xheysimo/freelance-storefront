// src/app/services/[slug]/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import PortableTextComponent from "@/components/sanity/PortableText"
import Link from "next/link"
// UPGRADE 1: Use Lucide icons for consistency
import { Check, Clock, ShieldCheck, Zap, DollarSign, ArrowRight } from "lucide-react" 
import Portfolio, { Project } from "@/components/portfolio/Portfolio"
import Testimonials, { Testimonial } from "@/components/testimonials/Testimonials"

// --- TYPES (Unchanged) ---
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
  summary: string
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

const SERVICE_QUERY = `*[_type == "service" && slug.current == $slug][0]{
  _id,
  title,
  summary,
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

// --- METADATA (Unchanged) ---
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

// --- PAGE COMPONENT WITH UI/UX UPGRADES ---
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
    <main className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      
      {/* 1. Hero Section + Price Bar (Full Width Banner) */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            
            {/* Title Block */}
            <div className="text-center lg:text-left mx-auto max-w-3xl lg:max-w-none">
                <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 flex items-center justify-center lg:justify-start">
                    <Zap className="h-4 w-4 mr-2" /> Fixed-Price Service Package
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                    {service.title}
                </h1>
                <p className="mt-4 text-xl leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0">
                    {service.summary}
                </p>
            </div>

            {/* UPGRADE 2: Price Bar for Mobile/Tablet */}
            <div className="lg:hidden mt-10 w-full rounded-xl bg-white dark:bg-gray-950 shadow-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        £{service.priceGBP}
                    </span>
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                        {service.priceSuffix}
                    </span>
                </div>
                
                <Link
                    href={`/book/${service.slug}`}
                    className="block w-full rounded-xl bg-indigo-600 px-3.5 py-3 text-center text-base font-semibold text-white shadow-md hover:bg-indigo-700 transition"
                >
                    {service.ctaText} <ArrowRight className="inline h-5 w-5 ml-1 mb-0.5" />
                </Link>
                <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-500 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 mr-1 shrink-0" /> Fixed Price. Guaranteed Scope.
                </p>
            </div>

        </div>
      </section>

      {/* 2. Main Content - Two Column Layout */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-16">
          
          {/* 2a. Left Column (Main Content) */}
          <article className="lg:col-span-2 space-y-10 lg:space-y-12">
            
            {/* Render Benefits (What's Included?) */}
            {service.benefits && service.benefits.length > 0 && (
              <div className='border-b border-gray-100 dark:border-gray-800 pb-10'>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    What's Included in this Package?
                </h2>
                {/* UPGRADE 3: Two-column feature grid for visual clarity */}
                <ul className="not-prose list-none p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"> 
                  {service.benefits.map((benefit) => (
                    <li key={benefit._key} className="flex gap-4">
                      {/* Using Lucide Check icon */}
                      <Check className="h-6 w-6 text-indigo-600 shrink-0 mt-1" /> 
                      <div>
                        <strong className="block text-gray-900 dark:text-white">
                            {benefit.title}
                        </strong>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {benefit.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Render Full Details (Technical Spec) */}
            {service.details && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Technical Specifications & Scope
                </h2>
                {/* UPGRADE: Applied prose styles within a standard div for better control */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <PortableTextComponent value={service.details} />
                </div>
              </div>
            )}
          </article>

          {/* 2b. Right Column (Sticky Booking Card - Hidden on mobile, shown on desktop) */}
          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-24 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-2xl bg-gray-50 dark:bg-gray-900">
                
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-4">Package Price</p>
                <div className="flex items-end mb-6">
                    <span className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        £{service.priceGBP}
                    </span>
                    <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                        {service.priceSuffix}
                    </span>
                </div>
              
                <Link
                    href={`/book/${service.slug}`}
                    className="block w-full rounded-xl bg-indigo-600 px-3.5 py-3 text-center text-base font-semibold text-white shadow-lg hover:bg-indigo-700 transition"
                >
                    {service.ctaText} <ArrowRight className="inline h-5 w-5 ml-1 mb-0.5" />
                </Link>
                
                {/* UPGRADE 4: Trust/Guarantee Icons */}
                <div className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                        Fixed-Price Guarantee (No hidden fees)
                    </p>
                    <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-indigo-500 shrink-0" />
                        Typically delivered in 48-72 hours
                    </p>
                    <p className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-yellow-500 shrink-0" />
                        Card authorized, not charged until completion.
                    </p>
                </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 3. Related Projects (Full Width - Increased prominence) */}
      {service.relatedProjects && service.relatedProjects.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
            <Portfolio
                projects={service.relatedProjects}
                title="Case Studies For This Service"
            />
        </div>
      )}

      {/* 4. Related Testimonials (Full Width) */}
      {relatedTestimonials.length > 0 && (
        <Testimonials
          testimonials={relatedTestimonials}
          title="Direct Feedback on this Service Type"
        />
      )}
    </main>
  )
}