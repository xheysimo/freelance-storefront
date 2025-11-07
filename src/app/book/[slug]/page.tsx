// src/app/book/[slug]/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import CheckoutWrapper from "@/components/checkout/CheckoutWrapper"
import { notFound } from 'next/navigation'

interface Service {
  title: string
  priceGBP: number
}

// This function fetches the data for a SINGLE service based on its slug
const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  const query = `*[_type == "service" && slug.current == $slug][0]{
    title,
    priceGBP,
  }`
  
  // --- THIS IS THE FIX ---
  // 1. Fetch as <any> to bypass the incorrect linter constraint
  const result = await sanityFetch<any>({ 
    query, 
    params: { slug } 
  })
  
  // 2. Cast the data back to the correct type
  return result.data as Service | null 
  // --- END OF FIX ---
}

// This is the page component
export default async function BookServicePage({
  params,
}: {
  params: { slug: string }
}) {
  // This 'await' is still correct and necessary
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug)

  // If no service is found, show a 404 page
  if (!service) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <CheckoutWrapper 
        serviceName={service.title} 
        price={service.priceGBP} 
      />
    </main>
  )
}