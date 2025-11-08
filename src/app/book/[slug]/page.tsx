// src/app/book/[slug]/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import CheckoutWrapper from "@/components/checkout/CheckoutWrapper"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Zap } from 'lucide-react' // Icons for trust and navigation

interface Service {
  _id: string 
  title: string
  priceGBP: number
  priceSuffix: string
  serviceType: 'oneOff' | 'recurring'
  stripePriceId?: string
  projectBrief?: { 
    title: string
    fields: any[]
  }
}

// Update the query to fetch all necessary fields
const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  const query = `*[_type == "service" && slug.current == $slug][0]{
    _id,
    title,
    priceGBP,
    priceSuffix,
    serviceType,
    stripePriceId,
    projectBrief->{
      title,
      fields
    }
  }`
  
  const result = await sanityFetch<any>({ 
    query, 
    params: { slug } 
  })
  
  return result.data as Service | null 
}

// This is the page component
export default async function BookServicePage({
  params,
}: {
  params: { slug: string }
}) {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug)

  if (!service) {
    notFound()
  }

  // A recurring service MUST have a Stripe Price ID
  if (service.serviceType === 'recurring' && !service.stripePriceId) {
    throw new Error('This recurring service is not configured with a Stripe Price ID.')
  }

  return (
    // UPGRADE 1: Use full width, structured padding, and clear background
    <main className="w-full bg-gray-50 dark:bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        
        {/* Navigation & Security Header */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700 mb-10">
            <Link 
                href={`/services/${resolvedParams.slug}`} 
                className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Service Details
            </Link>
            
            {/* UPGRADE 2: Security Badge */}
            <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                <Lock className="h-4 w-4 mr-1.5" /> Secure Checkout
            </div>
        </div>
        
        {/* Service Summary Card */}
        <div className="rounded-xl bg-white dark:bg-gray-950 shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-10">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-1">
                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3" /> 
                Purchasing: {service.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
                This is a {service.serviceType === 'recurring' ? 'monthly recurring service' : 'one-off fixed-price package'}.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    £{service.priceGBP}
                </span>
                <span className="ml-2 text-base text-gray-500 dark:text-gray-400">
                    {service.priceSuffix}
                </span>
            </div>
        </div>

        <main className="flex flex-col items-center justify-center p-6">
            <CheckoutWrapper 
                serviceId={service._id} 
                serviceName={service.title} 
                price={service.priceGBP} 
                priceSuffix={service.priceSuffix}
                serviceType={service.serviceType}
                stripePriceId={service.stripePriceId}
                projectBrief={service.projectBrief}
                serviceSlug={resolvedParams.slug}
            />
        </main>
        {/* Final Trust/Footer Area */}
        <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            All payments are processed securely via Stripe. Your information is encrypted and protected.
        </div>

      </div>
    </main>
  )
}