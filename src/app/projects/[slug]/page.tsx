// src/app/projects/[slug]/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import SanityImage from "@/components/sanity/SanityImage"
// import { blockContentType } from "@/sanity/schemaTypes/blockContentType" // This import is unused, can be removed
import PortableTextComponent from "@/components/sanity/PortableText"

// --- 1. IMPORT LINK & ICONS ---
import Link from "next/link"
import { ExternalLink, Code } from "lucide-react"

// 1. Define the type for a single project (unchanged)
interface Project {
  title: string
  clientName: string
  coverImage: SanityImageSource
  summary: string
  challenge: any // Type for blockContent
  solution: any // Type for blockContent
  results: any // Type for blockContent
  liveUrl?: string
  githubUrl?: string
  seo: {
    metaTitle: string
    metaDescription: string
  }
}

// 2. Define the query to get a single project by slug (unchanged)
const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  title,
  clientName,
  coverImage,
  summary,
  challenge,
  solution,
  results,
  liveUrl,
  githubUrl,
  seo
}`

// 3. Generate dynamic metadata for SEO (unchanged, but includes param fix)
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const resolvedParams = await params // <-- FIX
  const result = await sanityFetch<any>({
    query: PROJECT_QUERY,
    params: { slug: resolvedParams.slug }, // <-- FIX
  })
  const project = result.data as Project | null
  if (!project) {
    return {}
  }
  return {
    title: project.seo.metaTitle,
    description: project.seo.metaDescription,
  }
}

// 4. The page component
export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const resolvedParams = await params // <-- FIX
  const result = await sanityFetch<any>({
    query: PROJECT_QUERY,
    params: { slug: resolvedParams.slug }, // <-- FIX
  })
  const project = result.data as Project | null

  if (!project) {
    notFound()
  }

  return (
    // --- 2. UI/UX UPGRADE: Use consistent main element styling ---
    <main className="w-full bg-white dark:bg-gray-950">
      <article className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
        {/* Header (unchanged, matches style) */}
        <div className="text-center">
          <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            {project.clientName}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {project.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            {project.summary}
          </p>
        </div>

        {/* Cover Image (unchanged) */}
        {project.coverImage && (
          <div className="relative h-96 w-full mt-12 rounded-2xl shadow-lg overflow-hidden">
            <SanityImage
              source={project.coverImage}
              alt={project.title}
              className="object-cover"
            />
          </div>
        )}

        {/* --- 3. UI/UX UPGRADE: Add Project Links Section --- */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="mt-12 flex items-center justify-center gap-4 border-t border-b border-gray-100 dark:border-gray-800 py-6">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                <ExternalLink className="h-4 w-4 mr-2" /> View Live Site
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Code className="h-4 w-4 mr-2" /> View Code
              </Link>
            )}
          </div>
        )}

        {/* Rich Content Sections (unchanged, prose is correct) */}
        <div className="prose prose-lg dark:prose-invert mt-16 mx-auto">
          {project.challenge && (
            <>
              <h2>The Challenge</h2>
              <PortableTextComponent value={project.challenge} />
            </>
          )}
          {project.solution && (
            <>
              <h2>The Solution</h2>
              <PortableTextComponent value={project.solution} />
            </>
          )}
          {project.results && (
            <>
              <h2>The Results</h2>
              <PortableTextComponent value={project.results} />
            </>
          )}
        </div>
      </article>
    </main>
  )
}