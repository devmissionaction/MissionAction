// src/app/api/download/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/lib/sanity'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is missing' }, { status: 400 })
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Vérifier si la session est bien payée et que la méthode de paiement est une carte bancaire
    if (session.payment_status !== 'paid' || session.payment_method_types[0] !== 'card') {
      return NextResponse.json({ error: 'Payment not completed or invalid payment method' }, { status: 403 })
    }

    // Récupérer les informations sur l'article acheté
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 })
    const priceIdFromStripe = lineItems.data[0]?.price?.id

    if (!priceIdFromStripe) {
      return NextResponse.json({ error: 'Price ID not found for this session' }, { status: 404 })
    }

    // Requête Sanity pour trouver le PDF correspondant au priceId
    const query = `*[_type == "issue" && stripePriceId == $priceId][0]{
        "pdfUrl": pdfFile.asset->url
    }`
    const numero = await client.fetch(query, { priceId: priceIdFromStripe })

    if (!numero || !numero.pdfUrl) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    return NextResponse.json({ pdfUrl: numero.pdfUrl })

  } catch (err: any) {
    console.error('Erreur API téléchargement:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}