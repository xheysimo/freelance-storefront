// src/components/sanity/PortableText.tsx
'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import SanityImage from './SanityImage'
import Link from 'next/link'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-6 text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {children}
      </p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-lg text-gray-600 dark:text-gray-400">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-lg text-gray-600 dark:text-gray-400">
        {children}
      </ol>
    ),
  },

  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-mono text-sm px-1.5 py-1 rounded">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value.href || ''
      if (href.startsWith('/')) {
        return (
          <Link
            href={href}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {children}
          </Link>
        )
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    image: ({ value }) => (
      <div className="relative h-96 my-8 rounded-lg overflow-hidden shadow-lg">
        <SanityImage source={value} alt={value.alt || 'Project image'} />
      </div>
    ),
  },
}

export default function PortableTextComponent({ value }: { value: any }) {
  return <PortableText value={value} components={components} />
}