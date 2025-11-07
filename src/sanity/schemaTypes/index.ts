// src/sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import { blockContentType } from './blockContentType'
import { featureType } from './featureType'
import { seoType } from './seoType'
import { serviceType } from './serviceType'
import { projectType } from './projectType'
import { testimonialType } from './testimonialType'
import { briefForm } from './briefForm'
import { formField } from './formField'
import { orderType } from './orderType'     // <-- 1. IMPORT

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    orderType,                            // <-- 2. ADD
    serviceType,
    projectType,
    testimonialType,
    briefForm,

    // Objects
    blockContentType,
    featureType,
    seoType,
    formField,
  ],
}