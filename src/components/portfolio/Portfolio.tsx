// src/components/portfolio/Portfolio.tsx
import SanityImage from '@/components/sanity/SanityImage'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Link from 'next/link'
import { ArrowRight, Code, ExternalLink, Briefcase } from 'lucide-react'

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
  industry?: string 
}

type PortfolioProps = {
  projects: Project[]
  title?: string
}

export default function Portfolio({ projects, title }: PortfolioProps) { 
  if (!projects || projects.length === 0) {
    return (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No projects found. Check back soon!
        </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-0 lg:px-0">

        {/* Grid for the projects */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"> 
          {projects.map((project) => (
            <div
              key={project._id}
              // REFINED UI: Removed shadow-2xl, using a focus on border and background contrast.
              // Added subtle translate Y on hover for a cleaner lift effect.
              className="flex flex-col rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-indigo-500 transform hover:-translate-y-1"
            >
              {/* Image container with aspect ratio for consistency */}
              {project.coverImage && (
                <Link 
                  href={`/projects/${project.slug}`} 
                  className="relative aspect-video w-full group overflow-hidden" // Link wraps the image
                >
                  <SanityImage
                    source={project.coverImage}
                    alt={project.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              )}

              {/* Content container */}
              <div className="flex flex-col flex-1 p-6">
                
                {/* Client Metadata (Credibility Marker) */}
                <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <Briefcase className="h-4 w-4 mr-1.5 text-indigo-500" />
                    {project.clientName}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {project.title}
                </h3>
                
                <p className="mt-3 flex-1 text-base text-gray-600 dark:text-gray-400">
                  {project.summary}
                </p>

                {/* --- Action Links --- */}
                {/* REFINED UI: Used padding and a clear top border for visual separation */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-3">
                  
                  {/* 1. View Case Study (PRIMARY CTA - Slightly less bulky) */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    Details <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>

                  {/* 2. Live Site (Secondary, transparent dark/light theme style) */}
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <ExternalLink className="h-4 w-4 mr-1.5" /> Live
                    </Link>
                  )}
                  
                  {/* 3. GitHub link (Tertiary, text-only style) */}
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      <Code className="h-4 w-4 mr-1.5" /> Code
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}