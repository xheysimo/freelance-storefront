// src/sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import { blockContentType } from './blockContentType'
import { featureType } from './featureType'
import { seoType } from './seoType'
import { serviceType } from './serviceType'
import { projectType } from './projectType'
import { testimonialType } from './testimonialType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    serviceType,
    projectType,
    testimonialType,

    // Objects
    blockContentType,
    featureType,
    seoType,
  ],
}