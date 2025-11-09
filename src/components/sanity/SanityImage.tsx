// src/components/SanityImage.tsx
'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

type SanityImageProps = {
  source: SanityImageSource
  alt: string
  className?: string
  sizes?: string
}

export default function SanityImage({
  source,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: SanityImageProps) {
  const imageUrl = urlFor(source).auto('format').fit('max').url()

  return (
    <Image
      src={imageUrl}
      alt={alt}
      className={className}
      fill
      style={{ objectFit: 'cover' }}
      sizes={sizes}
    />
  )
}