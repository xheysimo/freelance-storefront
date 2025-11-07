// src/app/book/[slug]/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import CheckoutWrapper from "@/components/checkout/CheckoutWrapper"
import { notFound } from 'next/navigation'

interface Service {
  _id: string // <-- 1. ADD THIS
  title: string
  priceGBP: number
  priceSuffix: string
  serviceType: 'oneOff' | 'recurring'
  stripePriceId?: string
  projectBrief?: { 
    title: string
    fields: any[]
    formspreeEndpoint: string 
  }
}

// Update the query to fetch all necessary fields
const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  const query = `*[_type == "service" && slug.current == $slug][0]{
    _id, // <-- 2. FETCH THIS
    title,
    priceGBP,
    priceSuffix,
    serviceType,
    stripePriceId,
    projectBrief->{
      title,
      fields,
      formspreeEndpoint
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
    // You can render a more helpful error page if you like
    throw new Error('This recurring service is not configured with a Stripe Price ID.')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <CheckoutWrapper 
        serviceId={service._id} // <-- 3. PASS THE ID
        serviceName={service.title} 
        price={service.priceGBP} 
        priceSuffix={service.priceSuffix}
        serviceType={service.serviceType}
        stripePriceId={service.stripePriceId}
        projectBrief={service.projectBrief}
      />
    </main>
  )
}