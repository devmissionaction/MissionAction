// src/lib/sanity.js
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'mafzawab', 
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
})
