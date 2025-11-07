'use client'

// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision' 
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'
import { CapturePaymentAction } from './src/sanity/actions/CapturePaymentAction'
import { CancelSubscriptionAction } from './src/sanity/actions/CancelSubscriptionAction' // <-- 1. IMPORT
import { apiVersion, dataset, projectId } from './src/sanity/env'

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
        return [
          // 2. Add your custom actions
          CapturePaymentAction,
          CancelSubscriptionAction, 
          // 3. Filter out default actions
          ...prev.filter(
            (action) =>
              !['publish', 'unpublish', 'delete'].includes(action.name)
          ),
        ]
      }
      // Otherwise, return the default actions
      return prev
    },
  },
})