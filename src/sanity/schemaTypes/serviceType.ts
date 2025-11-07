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
      name: 'stripePaymentLink',
      title: 'Stripe Payment Link (for One-Off)',
      type: 'url',
      hidden: ({document}) => document?.serviceType !== 'oneOff',
    }),
    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price ID (for Recurring)',
      type: 'string',
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