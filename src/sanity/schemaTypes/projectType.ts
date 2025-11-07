// src/sanity/schemaTypes/projectType.ts
import {defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Portfolio Project',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Project Title', type: 'string'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({name: 'clientName', title: 'Client Name', type: 'string'}),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'summary', title: 'Project Summary', type: 'text', rows: 3}),
    defineField({name: 'challenge', title: 'The Challenge', type: 'blockContent'}),
    defineField({name: 'solution', title: 'The Solution', type: 'blockContent'}),
    defineField({name: 'results', title: 'The Results', type: 'blockContent'}),
    defineField({
      name: 'servicesUsed',
      title: 'Services Used',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      to: [{type: 'testimonial'}],
    }),
    defineField({name: 'liveUrl', title: 'Live URL', type: 'url'}),
    defineField({name: 'githubUrl', title: 'GitHub URL', type: 'url'}),
    defineField({name: 'seo', title: 'SEO Settings', type: 'seo'}),
  ],
})