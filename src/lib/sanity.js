// src/lib/sanity.js
import { createClient } from '@sanity/client'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mafzawab',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
}

// Client pour le navigateur (utilise le cache CDN)
export const client = createClient({
  ...config,
  useCdn: true,
})

// Client pour le serveur (webhook, etc.)
// N'utilise pas le cache et doit avoir un token pour s'authentifier
export const serverClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // C'est cette variable qui est cruciale
})