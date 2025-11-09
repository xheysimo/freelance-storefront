// src/sanity/lib/mutationClient.ts
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

const writeToken = process.env.SANITY_API_WRITE_TOKEN

if (!writeToken) {
  throw new Error(
    'Missing environment variable: SANITY_API_WRITE_TOKEN. ' +
    'Go to https://www.sanity.io/manage and create a new token with "Editor" permissions.'
  )
}

export const sanityMutationClient = createClient({
  projectId,
  dataset,
  apiVersion,
  
  token: writeToken,
  
  useCdn: false, 
})