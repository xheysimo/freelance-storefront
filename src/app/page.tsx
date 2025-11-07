// src/app/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import { Key } from "react"
import Link from "next/link"
import Testimonials, { Testimonial } from "@/components/testimonials/Testimonials"
import Portfolio, { Project } from "@/components/portfolio/Portfolio"
// Import essential icons for speed, process, and trust
import { ArrowRightIcon, BriefcaseIcon, CheckCircle2, Star, Clock, Zap, User, Code, DollarSign, Layout, TrendingUp, ShoppingCart, Repeat2 } from "lucide-react"

// --- INTERFACES & QUERIES (Unchanged) ---
interface Service {
  _id: Key
  title: string
  summary: string
  priceGBP: number
  priceSuffix: string
  ctaText: string
  slug: string
}

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
}`

async function getPageData() {
  const [servicesResult, testimonialsResult, projectsResult] = await Promise.all([
    sanityFetch<any>({ query: SERVICES_QUERY }),
    sanityFetch<any>({ query: TESTIMONIALS_QUERY }),
    sanityFetch<any>({ query: PROJECTS_QUERY }),
  ])
  return {
    services: servicesResult.data as Service[],
    testimonials: testimonialsResult.data as Testimonial[],
    projects: projectsResult.data as Project[],
  }
}

// --- HOME COMPONENT WITH ENHANCED UI/UX ---

export default async function Home() {
  const { services, testimonials, projects } = await getPageData()
  const popularServiceId = services.length > 0 ? services[0]._id : null

  return (
    <main className="flex min-h-screen flex-col items-center bg-white dark:bg-gray-950">
      
      {/* 📞 Top Contact Banner - Professional & Accessible */}
      <div className="w-full bg-indigo-700 text-white p-3 text-center text-sm font-medium dark:bg-indigo-900">
        <DollarSign className="inline h-4 w-4 mr-1 mb-0.5]" />
        Need a custom quote? <Link href="/contact" className="underline font-bold hover:text-indigo-200 ml-1">Get an Expert Estimate Now</Link>
      </div>

      {/* 🚀 Hero Section - Emphasize Speed and Packages */}
      <div className="w-full py-24 sm:py-32 lg:py-40 border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          
          <p className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-base font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 mb-6">
            <Zap className="h-4 w-4 fill-indigo-500 mr-2" />
            Fast-Track Development: Packages Ready to Go
          </p>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-gray-900 dark:text-white">
            Your Go-To Place for <span className="text-indigo-600 dark:text-indigo-400">Quick Dev Fixes</span>.
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            **Transparent, fixed-price services** delivered by a senior engineer. Skip the lengthy scoping calls and **just order the solution.**
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#services"
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-xl hover:bg-indigo-500 transition focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus-visible:outline-2"
            >
              Shop All Services <ShoppingCart className="inline ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#process"
              className="w-full sm:w-auto text-lg font-semibold leading-6 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 py-3"
            >
              See How It Works <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* ➡️ NEW SECTION: Quick Fix Process - Establishes efficiency and organization */}
      <div id="process" className="w-full py-20 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Speed & Efficiency</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              The 3-Step Fixed-Price Process
            </p>
          </div>
          
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <li className="p-6 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-gray-800 shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">1.</span>
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Select Package</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Browse our services and choose the fixed-scope solution that matches your need. No lengthy quotes required.</p>
            </li>
            <li className="p-6 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-gray-800 shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2.</span>
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Provide Details</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Complete a quick, guided brief form with all necessary access and details upon checkout.</p>
            </li>
            <li className="p-6 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-gray-800 shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">3.</span>
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Receive Delivery</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Your fix or feature is delivered fast and guaranteed. Review and approve the final work.</p>
            </li>
          </ol>
        </div>
      </div>
      
      {/* 🛠️ Services Section - Organized Pricing Tiers */}
      <div id="services" className="w-full max-w-7xl px-6 lg:px-8 py-20 sm:py-24">
        
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Fixed-Price Catalogue</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Ready-to-Order Development Packages
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Choose from common, high-value fixes and features with **clear timelines and guaranteed scope.**
          </p>
        </div>

        {/* Service Cards - Improved Responsiveness: MD Grid 2, LG Grid 3 */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <div 
              key={service._id} 
              className={`flex flex-col rounded-3xl p-8 shadow-xl transition duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                service._id === popularServiceId
                  ? "border-4 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-gray-900/50"
                  : "border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
              }`}
            >
              {service._id === popularServiceId && (
                <div className="mb-4 self-start rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
                  BEST VALUE
                </div>
              )}

              <div className="shrink-0"> 
                <BriefcaseIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
                {service.title}
              </h2>

              <p className="mt-4 flex-1 text-base text-gray-600 dark:text-gray-400">
                {service.summary}
              </p>

              <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                  £{service.priceGBP}
                </span>
                <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                  {service.priceSuffix}
                </span>
              </div>
              
              <Link
                href={`/services/${service.slug}`}
                className="mt-8 block w-full rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-indigo-700 transition text-center"
              >
                {service.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* 💼 Portfolio Section - Full Width, Clear Contrast */}
      <div id="portfolio" className="w-full bg-gray-50 dark:bg-gray-900 py-20 sm:py-24 border-t border-b border-gray-100 dark:border-gray-800"> 
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Proven Results</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Recent Projects Delivered Fast
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              See how we deliver high-quality code and quick turnaround times for our clients.
            </p>
          </div>
          <Portfolio projects={projects} />
        </div>
      </div>

      {/* 👤 Meet the Expert - Simplified and Professional */}
      <div className="w-full bg-white dark:bg-gray-950 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Direct Access to Expertise</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Quality Code from a Senior Engineer
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                **I handle your request personally.** Get senior-level quality without the agency friction. I specialize in **[Key Tech Stack, e.g., Next.js & Sanity]** and focus only on efficient, pre-scoped work.
              </p>
              <div className="mt-10">
                <Link
                  href="/about"
                  className="rounded-xl bg-transparent border border-gray-300 dark:border-gray-700 px-5 py-2.5 text-base font-semibold text-gray-900 dark:text-white shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  My Qualifications <ArrowRightIcon className="inline ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/3 flex justify-center">
              {/* Placeholder for an actual image */}
              <div className="aspect-square w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-2xl overflow-hidden">
                <User className="h-20 w-20 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials component */}
      <Testimonials testimonials={testimonials} />
      
    </main>
  )
}