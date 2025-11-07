// src/sanity/lib/mutationClient.ts
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Get the write token from your environment variables
const writeToken = process.env.SANITY_API_WRITE_TOKEN

if (!writeToken) {
  throw new Error(
    'Missing environment variable: SANITY_API_WRITE_TOKEN. ' +
    'Go to https://www.sanity.io/manage and create a new token with "Editor" permissions.'
  )
}

/**
 * A separate Sanity client used for server-side mutations.
 * This client is authenticated with a write token.
 * DO NOT expose this client to the browser.
 */
export const sanityMutationClient = createClient({
  projectId,
  dataset,
  apiVersion,
  
  // Use the write token
  token: writeToken,
  
  // Don't use the CDN for write operations
  useCdn: false, 
})