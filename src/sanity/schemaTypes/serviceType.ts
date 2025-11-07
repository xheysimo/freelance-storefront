// src/sanity/schemaTypes/serviceType.ts
import {defineField, defineType} from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Service / Membership',
  type: 'document',
  fields: [
    // --- Core Info ---
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      description: 'e.g., "Monthly WordPress Maintenance", "One-Off Bug Fix"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          {title: 'One-Off Fee', value: 'oneOff'},
          {title: 'Recurring (Membership)', value: 'recurring'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'details',
      title: 'Full Details',
      type: 'blockContent', // Uses our rich text object
    }),

    // --- Pricing (UK-Targeted) ---
    defineField({
      name: 'priceGBP',
      title: 'Price (GBP)',
      type: 'number',
    }),
    defineField({
      name: 'priceSuffix',
      title: 'Price Suffix',
      type: 'string',
      description: 'e.g., "per fix", "per month", "starting from"',
    }),
    defineField({
      name: 'vatNote',
      title: 'VAT Note',
      type: 'string',
      description: 'e.g., "VAT not applicable"',
      initialValue: 'VAT not applicable',
    }),
    
    // --- Conversion & Stripe ---
    defineField({
      name: 'benefits',
      title: 'Key Benefits / Features',
      type: 'array',
      of: [{type: 'feature'}], // Uses our reusable feature object
    }),
    defineField({
      name: 'ctaText',
      title: 'Call to Action Text',
      type: 'string',
      initialValue: 'Get Started',
    }),
    defineField({
      name: 'projectBrief',
      title: 'Project Brief Form',
      type: 'reference',
      to: [{type: 'briefForm'}],
      description: 'The form the customer will fill out *after* payment.',
    }),

    defineField({
      name: 'stripeProductId',
      title: 'Stripe Product ID',
      type: 'string',
      description: 'Auto-synced: The ID of the corresponding Stripe Product.',
      readOnly: true, 
      hidden: ({document}) => document?.serviceType !== 'recurring',
    }),

    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price ID (for Recurring)',
      type: 'string',
      description: 'This field is synced automatically from Stripe. Create a product in Stripe with metadata `sanity_slug` matching this service\'s slug.',
      readOnly: true, // This field is now auto-synced
      hidden: ({document}) => document?.serviceType !== 'recurring',
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo', // Uses our reusable SEO object
    }),
  ],
})