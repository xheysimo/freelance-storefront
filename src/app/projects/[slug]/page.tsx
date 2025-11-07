// src/app/projects/[slug]/page.tsx
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import SanityImage from "@/components/sanity/SanityImage"
import { blockContentType } from "@/sanity/schemaTypes/blockContentType" // We'll create this component next
import PortableTextComponent from "@/components/sanity/PortableText" // <-- Import new component

// 1. Define the type for a single project
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

// 2. Define the query to get a single project by slug
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

// 3. Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const result = await sanityFetch<any>({
    query: PROJECT_QUERY,
    params: { slug: params.slug },
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
  const result = await sanityFetch<any>({
    query: PROJECT_QUERY,
    params: { slug: params.slug },
  })
  const project = result.data as Project | null

  if (!project) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <article className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="text-center">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            {project.clientName}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            {project.summary}
          </p>
        </div>

        {/* Cover Image */}
        {project.coverImage && (
          <div className="relative h-96 w-full mt-12 rounded-2xl shadow-lg overflow-hidden">
            <SanityImage
              source={project.coverImage}
              alt={project.title}
              className="object-cover"
            />
          </div>
        )}

        {/* Rich Content Sections */}
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