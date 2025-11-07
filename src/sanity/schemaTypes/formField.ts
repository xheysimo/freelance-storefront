// src/sanity/schemaTypes/formField.ts
import {defineField, defineType} from 'sanity'

export const formField = defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The label for the form field (e.g., "What is your domain name?")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'slug',
      description: 'The machine-readable name (e.g., "domain_name"). Click Generate.',
      options: {source: 'label'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fieldType',
      title: 'Field Type',
      type: 'string',
      options: {
        list: [
          {title: 'Text Input', value: 'text'},
          {title: 'Text Area', value: 'textarea'},
          {title: 'Email', value: 'email'},
        ],
        layout: 'radio',
      },
      initialValue: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
      description: 'Optional: Faint text shown in the field before typing.',
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'fieldType',
    },
  },
})