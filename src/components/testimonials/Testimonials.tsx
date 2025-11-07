// src/components/Testimonials.tsx
import SanityImage from '@/components/sanity/SanityImage'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Define the shape of a single testimonial based on your schema
export interface Testimonial {
  _id: string
  authorName: string
  authorTitle: string
  authorImage: SanityImageSource
  quote: string
}

type TestimonialsProps = {
  testimonials: Testimonial[]
  title?: string // <-- 1. Add optional title prop
}

export default function Testimonials({ testimonials, title }: TestimonialsProps) { // <-- 2. Get prop
  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    // This section wrapper will span the full width
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950 w-full mt-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {title || 'What People Are Saying'} {/* <-- 3. Use prop or default */}
        </h2>

        {/* Grid for the testimonials */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial._id}
              className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg bg-white dark:bg-gray-900"
            >
              <blockquote className="flex-1 text-lg text-gray-700 dark:text-gray-300">
                <p>"{testimonial.quote}"</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                {testimonial.authorImage && (
                  // Parent div must be relative for the fill image to work
                  <div className="relative h-14 w-14 overflow-hidden rounded-full">
                    <SanityImage
                      source={testimonial.authorImage}
                      alt={testimonial.authorName}
                      className="rounded-full"
                    />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.authorName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.authorTitle}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}