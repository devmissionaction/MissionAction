// /app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@sanity/client'

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

// Sanity
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2023-08-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const { numeroSlug } = await req.json()

    if (!numeroSlug) {
      return NextResponse.json({ error: 'numeroSlug manquant' }, { status: 400 })
    }

    // Chercher dans Sanity le priceId lié au slug
    const query = `*[_type == "numero" && slug.current == $slug][0]{
      title,
      priceId
    }`
    const numero = await client.fetch(query, { slug: numeroSlug })

    if (!numero || !numero.priceId) {
      return NextResponse.json(
        { error: 'Numéro introuvable ou priceId manquant' },
        { status: 404 }
      )
    }

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: numero.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erreur Checkout:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
