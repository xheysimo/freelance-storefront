// src/sanity/schemaTypes/orderType.ts
import {defineField, defineType} from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    // ... customerName, customerEmail, service, oneOffStatus, subscriptionStatus...
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
      name: 'service',
      title: 'Service',
      type: 'reference',
      to: [{type: 'service'}],
      readOnly: true,
    }),
    
    // --- Status for One-Off Payments ---
    defineField({
      name: 'oneOffStatus',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New (Payment Authorized)', value: 'new'},
          {title: 'Awaiting Client', value: 'awaitingClient'},
          {title: 'Completed (Ready to Capture)', value: 'completed'},
          {title: 'Paid', value: 'paid'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      initialValue: 'new',
      hidden: ({document}) => !document?.stripePaymentIntentId,
    }),
    
    // --- Status for Recurring Subscriptions ---
    defineField({
      name: 'subscriptionStatus',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'In Progress', value: 'inProgress'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      initialValue: 'inProgress',
      hidden: ({document}) => !document?.stripeSubscriptionId,
    }),

    // ... stripePaymentIntentId, stripeSubscriptionId ...
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'stripeSubscriptionId',
      title: 'Stripe Subscription ID',
      type: 'string',
      readOnly: true,
    }),

    // --- Brief Information ---
    defineField({
      name: 'projectBrief',
      title: 'Project Brief (Text)',
      type: 'text',
      rows: 15,
      readOnly: true,
      description: 'Text-based fields from the project brief form.',
    }),
    
    // --- NEW FIELD FOR FILES ---
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
    // --- END NEW FIELD ---

    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'blockContent',
      description: 'Your private notes, "what I\'ve done," checklists, etc.',
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'service.title',
      oneOffStatus: 'oneOffStatus',
      subStatus: 'subscriptionStatus',
    },
    prepare({title, subtitle, oneOffStatus, subStatus}) {
      const status = oneOffStatus || subStatus
      
      const statusMap: Record<string, string> = {
        new: 'New (Authorized) 📦',
        inProgress: 'In Progress 🏗️',
        completed: 'Completed (Ready to Capture) ✅',
        paid: 'Paid 💸',
        cancelled: 'Cancelled ❌',
        SubinProgress: 'In Progress 🏗️',
      }
      return {
        title: title || 'New Order',
        subtitle: `${subtitle} | ${statusMap[status] || status}`,
      }
    },
  },
})