// src/sanity/schemaTypes/orderType.ts
import {defineField, defineType} from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
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
      name: 'service',
      title: 'Service',
      type: 'reference',
      to: [{type: 'service'}],
      readOnly: true,
    }),
    
    // --- NEW: Status for One-Off Payments ---
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
      // Show this field ONLY if it's a one-off order
      hidden: ({document}) => !document?.stripePaymentIntentId,
    }),
    
    // --- NEW: Status for Recurring Subscriptions ---
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
      // Show this field ONLY if it's a subscription order
      hidden: ({document}) => !document?.stripeSubscriptionId,
    }),

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
    defineField({
      name: 'projectBrief',
      title: 'Project Brief',
      type: 'text',
      rows: 15,
      readOnly: true,
    }),
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
      // Use whichever status is active
      const status = oneOffStatus || subStatus
      
      const statusMap: Record<string, string> = {
        // One-Off
        new: 'New (Authorized) 📦',
        inProgress: 'In Progress 🏗️', // Keep this for subs
        completed: 'Completed (Ready to Capture) ✅',
        paid: 'Paid 💸',
        cancelled: 'Cancelled ❌',
        // Sub
        SubinProgress: 'In Progress 🏗️',
      }
      return {
        title: title || 'New Order',
        subtitle: `${subtitle} | ${statusMap[status] || status}`,
      }
    },
  },
})