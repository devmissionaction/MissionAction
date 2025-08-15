// /app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import sanityClient from '@sanity/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_DATASET) {
  throw new Error('SANITY_PROJECT_ID ou SANITY_DATASET manquant dans les variables d’environnement');
}

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2023-08-01',
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const { numeroId } = await req.json()

    // Chercher le priceId du numéro dans Sanity
    const query = `*[_type == "numero" && _id == $numeroId][0]{ priceId }`
    const numero = await client.fetch(query, { numeroId })

    if (!numero?.priceId) {
      return NextResponse.json({ error: 'Price ID non trouvé pour ce numéro' }, { status: 400 })
    }

    // Créer la session Stripe avec ce priceId
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: numero.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
