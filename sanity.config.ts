'use client'

// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'
import { apiVersion, dataset, projectId } from './src/sanity/env'

// 1. Import ONLY our smart action
// import { CapturePaymentAction } from './src/sanity/actions/CapturePaymentAction' // <-- REMOVE THIS
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
      // If the schema type is 'order', use our custom action logic
      if (schemaType === 'order') {
        const actions = prev.flatMap((action) => {
          // Replace 'publish' with our smart action
          if (action.action === 'publish') {
            return [PublishOrderAction]
          }
          // Remove 'unpublish' and 'delete'
          if (action.action === 'unpublish' || action.action === 'delete') {
            return []
          }
          // Keep all other actions
          return [action]
        })

        // We no longer need to add CapturePaymentAction here
        return actions
      }

      // --- 2. Add new logic for 'quote' documents ---
      if (schemaType === 'quote') {
        // Start with default actions
        const actions = [...prev]
        
        // Add our custom action to the list
        actions.push(GeneratePaymentLinkAction)
        
        return actions
      }

      // For all other document types, return the default actions
      return prev
    },
  },
})