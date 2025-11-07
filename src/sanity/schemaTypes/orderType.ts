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
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New (Payment Authorized)', value: 'new'},
          {title: 'In Progress', value: 'inProgress'},
          {title: 'Awaiting Client', value: 'awaitingClient'},
          {title: 'Completed (Ready to Capture)', value: 'completed'},
          {title: 'Paid', value: 'paid'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      initialValue: 'new',
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
      status: 'status',
    },
    prepare({title, subtitle, status}) {
      // --- FIX: Explicitly typed statusMap ---
      const statusMap: Record<string, string> = {
        new: 'New (Authorized) 📦',
        inProgress: 'In Progress 🏗️',
        completed: 'Completed (Ready to Capture) ✅',
        paid: 'Paid 💸',
        cancelled: 'Cancelled ❌',
      }
      return {
        title: title || 'New Order',
        subtitle: `${subtitle} | ${statusMap[status] || status}`, // --- This is now valid
      }
    },
  },
})