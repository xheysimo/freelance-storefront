// src/components/portfolio/Portfolio.tsx
import SanityImage from '@/components/sanity/SanityImage'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Link from 'next/link'

// Define the shape of a single project
export interface Project {
  _id: string
  title: string
  clientName: string
  coverImage: SanityImageSource
  summary: string
  liveUrl?: string
  githubUrl?: string
  slug: string
}

type PortfolioProps = {
  projects: Project[]
  title?: string // <-- 1. Add optional title prop
}

export default function Portfolio({ projects, title }: PortfolioProps) { // <-- 2. Get prop
  if (!projects || projects.length === 0) {
    return null
  }

  return (
    // This section wrapper will span the full width
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 w-full">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {title || 'My Recent Work'} {/* <-- 3. Use prop or default */}
        </h2>

        {/* Grid for the projects */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden bg-white dark:bg-gray-950"
            >
              {/* Image container */}
              {project.coverImage && (
                <div className="relative h-60 w-full">
                  <SanityImage
                    source={project.coverImage}
                    alt={project.title}
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content container */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-indigo-500">
                  {project.clientName}
                </p>
                <p className="mt-3 flex-1 text-gray-600 dark:text-gray-400">
                  {project.summary}
                </p>

                {/* --- MODIFIED LINKS --- */}
                <div className="mt-6 flex gap-4">
                  {/* 1. Link to the detail page (primary) */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    View Case Study
                  </Link>

                  {/* 2. Link to the live site (secondary) */}
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Live Site
                    </Link>
                  )}
                  
                  {/* 3. GitHub link remains (secondary) */}
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      View Code
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}