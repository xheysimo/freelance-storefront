'use client'

// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { CancelSubscriptionAction } from './src/sanity/actions/CancelSubscriptionAction'
import { PublishOrderAction } from './src/sanity/actions/PublishOrderAction'
import { GeneratePaymentLinkAction } from '@/sanity/actions/GeneratePaymentLinkAction'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schema.types,
  },

  document: {
    actions: (prev, { schemaType }) => {
      if (schemaType === 'order') {
        const actions = prev.flatMap((action) => {
          if (action.action === 'publish') {
            return [PublishOrderAction, CancelSubscriptionAction]
          }
          if (action.action === 'unpublish' || action.action === 'delete') {
            return []
          }
          return [action]
        })

        return actions
      }

      if (schemaType === 'quote') {
        const actions = [...prev]
        
        actions.push(GeneratePaymentLinkAction)
        
        return actions
      }

      return prev
    },
  },
})