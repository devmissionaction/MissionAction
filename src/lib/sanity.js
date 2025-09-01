import { createClient } from '@sanity/client'

// Configuration de base utilisée par votre site public (côté client)
const baseConfig = {
  projectId: 'mafzawab', // Votre Project ID
  dataset: 'production',   // Votre Dataset
  apiVersion: '2024-01-01', // Utilisez une date récente
}

// Client pour le côté client (navigateur) - rapide grâce au CDN
export const client = createClient({
  ...baseConfig,
  useCdn: true, 
})

// --- CLIENT PRIVILÉGIÉ POUR LE CÔTÉ SERVEUR (WEBHOOKS, API ROUTES) ---
// Ce client bypass le cache (useCdn: false) et s'authentifie avec un token.
export const serverClient = createClient({
  ...baseConfig,
  useCdn: false, // ESSENTIEL : On ne veut pas de cache pour le webhook.
  token: process.env.SANITY_API_TOKEN, // ESSENTIEL : Le token qui donne les droits de lecture.
})