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
    // --- NEW FIELD ---
    defineField({
      name: 'formspreeEndpoint',
      title: 'Formspree Endpoint URL',
      type: 'url',
      description: 'The unique URL from Formspree for this specific form.',
      validation: (Rule) => Rule.required(),
    }),
    // --- END NEW FIELD ---
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [{type: 'formField'}],
    }),
  ],
})