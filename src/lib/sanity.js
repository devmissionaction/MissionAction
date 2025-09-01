import { createClient } from '@sanity/client'

// Assurez-vous que ces variables d'environnement existent sur Vercel
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mafzawab';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

// Client public pour le site
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Client authentifié pour le serveur (webhook)
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Ne pas utiliser le cache
  token: process.env.SANITY_API_TOKEN, // Le token d'authentification
});