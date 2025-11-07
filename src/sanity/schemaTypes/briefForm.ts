// src/sanity/schemaTypes/briefForm.ts
import {defineField, defineType} from 'sanity'

export const briefForm = defineType({
  name: 'briefForm',
  title: 'Project Brief Form',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Form Title',
      type: 'string',
      description: 'e.g., "Web Development Project Brief"',
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [{type: 'formField'}],
    }),
  ],
})