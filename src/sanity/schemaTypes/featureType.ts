// src/sanity/schemaTypes/featureType.ts
import {defineField, defineType} from 'sanity'

export const featureType = defineType({
  name: 'feature',
  title: 'Feature / Benefit',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
})