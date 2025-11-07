'use client'

// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision' // A common plugin, kept for completeness
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'
import { CapturePaymentAction } from './src/sanity/actions/CapturePaymentAction'
import { apiVersion, dataset, projectId } from './src/sanity/env'

export default defineConfig({
  basePath: '/studio', // Your studio's base path
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure,
    }),
    // Add other plugins like visionTool if you use them
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schema.types,
  },

  document: {
    // This is the new, crucial part
    actions: (prev, { schemaType }) => {
      // If the document type is 'order', add our custom action
      if (schemaType === 'order') {
        return [CapturePaymentAction, ...prev]
      }
      // Otherwise, return the default actions
      return prev
    },
  },
})