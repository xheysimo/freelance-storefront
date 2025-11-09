// src/sanity/schemaTypes/quoteType.ts
import {defineField, defineType} from 'sanity'

export const quoteType = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Estimated (Link Sent)', value: 'estimated'},
          {title: 'Converted (Paid)', value: 'converted'},
          {title: 'Declined', value: 'declined'},
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    
    defineField({
      name: 'estimatedPrice',
      title: 'Estimated Price (GBP)',
      type: 'number',
      description: 'Set the price you want to quote the client.',
    }),
    defineField({
      name: 'checkoutLink',
      title: 'Generated Payment Link',
      type: 'url',
      description: 'This will be generated after you set a price.',
      readOnly: true,
    }),
    
    defineField({
      name: 'projectBrief',
      title: 'Project Brief (Text)',
      type: 'text',
      rows: 15,
      readOnly: true,
      description: 'Text-based fields from the quote form.',
    }),
    defineField({
      name: 'briefFiles',
      title: 'Brief Files',
      type: 'array',
      of: [
        {
          title: 'Brief File',
          type: 'file',
          options: {
            storeOriginalFilename: true,
          },
        },
      ],
      readOnly: true,
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'blockContent',
      description: 'Your private notes about this lead.',
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'customerEmail',
      status: 'status',
    },
    prepare({title, subtitle, status}) {
      const statusMap: Record<string, string> = {
        new: 'New Lead 📩',
        estimated: 'Estimate Sent ⏳',
        converted: 'Converted to Order ✅',
        declined: 'Declined ❌',
      }
      return {
        title: title || 'New Quote',
        subtitle: `${subtitle} | ${statusMap[status] || status}`,
      }
    },
  },
})