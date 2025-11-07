// src/components/sanity/PortableText.tsx
'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import SanityImage from './SanityImage'

// Define how custom components in your rich text should be rendered
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative h-96 my-8 rounded-lg overflow-hidden shadow-lg">
        <SanityImage source={value} alt={value.alt || 'Project image'} />
      </div>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-500 hover:text-indigo-600"
      >
        {children}
      </a>
    ),
  },
}

export default function PortableTextComponent({ value }: { value: any }) {
  return <PortableText value={value} components={components} />
}