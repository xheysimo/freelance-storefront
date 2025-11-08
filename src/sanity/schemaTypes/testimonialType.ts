// src/sanity/schemaTypes/testimonialType.ts
import {defineField, defineType} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'authorName', title: 'Author Name', type: 'string'}),
    defineField({
      name: 'authorTitle',
      title: 'Author Title / Company',
      type: 'string',
    }),
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 5}),
    defineField({
      name: 'project',
      title: 'Linked Project',
      type: 'reference',
      to: [{type: 'project'}],
    }),
  ],
})