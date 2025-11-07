// src/components/Testimonials.tsx
import SanityImage from '@/components/sanity/SanityImage'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { Quote, Star } from 'lucide-react' // Icons for visual appeal and review

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
  title?: string
}

export default function Testimonials({ testimonials, title }: TestimonialsProps) { 
  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    // UPGRADE 1: Increased vertical padding for prominence
    <section className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900 w-full"> 
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Star className="h-4 w-4 fill-indigo-500 mr-2" />
                Trusted by Clients Worldwide
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                {title || 'What People Are Saying'}
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                See real feedback on our **fixed-price guarantee** and **delivery speed.**
            </p>
        </div>

        {/* Grid for the testimonials */}
        {/* UPGRADE 2: Responsive layout (2 columns on MD, 3 on LG) */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial) => ( // Limiting to max 6 for cleanliness
            <figure
              key={testimonial._id}
              // UPGRADE 3: Refined card design, using soft hover lift
              className="flex flex-col rounded-xl p-8 bg-white dark:bg-gray-950 shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:translate-y-0.5"
            >
                {/* Visual Anchor (Quote Icon) */}
                <Quote className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-4 opacity-50" />
                
                <blockquote className="flex-1 text-lg italic text-gray-700 dark:text-gray-300">
                  <p className="before:content-['“'] after:content-['”'] leading-relaxed">
                    {testimonial.quote}
                  </p>
                </blockquote>
                
                <figcaption className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  
                  {testimonial.authorImage && (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full shrink-0"> {/* Slightly smaller image size */}
                      <SanityImage
                        source={testimonial.authorImage}
                        alt={testimonial.authorName}
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.authorName}
                    </div>
                    {/* UPGRADE 4: Added a visual accent to the title */}
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400"> 
                      {testimonial.authorTitle}
                    </div>
                  </div>
                </figcaption>
            </figure>
          ))}
        </div>
        
        {/* Final Call to Action / Credibility */}
        <div className="mt-16 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
                Want to be my next successful client?
            </p>
            <a 
                href="/contact" 
                className="inline-flex mt-4 items-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-indigo-700 transition"
            >
                Get Started Today &rarr;
            </a>
        </div>

      </div>
    </section>
  )
}