// /app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@sanity/client'

// --- Vérification des variables d'env ---
if (!process.env.STRIPE_SECRET_KEY) throw new Error('❌ STRIPE_SECRET_KEY manquant')
if (!process.env.SANITY_PROJECT_ID) throw new Error('❌ SANITY_PROJECT_ID manquant')
if (!process.env.SANITY_DATASET) throw new Error('❌ SANITY_DATASET manquant')

// --- Init Stripe ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
})

// --- Init Sanity ---
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2023-08-01',
  token: process.env.SANITY_API_TOKEN, // facultatif si lecture publique
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const { numeroSlug } = await req.json()

    if (!numeroSlug) {
      return NextResponse.json({ error: 'numeroSlug manquant' }, { status: 400 })
    }

    // 1️⃣ Récupération du priceId dans Sanity
    const query = `*[_type == "numero" && slug.current == $slug][0]{ title, priceId }`
    const numero = await client.fetch(query, { slug: numeroSlug })

    if (!numero || !numero.priceId) {
      return NextResponse.json({ error: 'Numéro ou priceId introuvable' }, { status: 404 })
    }

    // 2️⃣ Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: numero.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('❌ Erreur API Checkout', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
