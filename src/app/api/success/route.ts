import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/lib/sanity'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID manquant' }, { status: 400 })
    }

    // 1. Récupérer la session Stripe pour vérifier le paiement
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 402 })
    }

    // 2. Récupérer le priceId de l'article acheté
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 })
    const priceId = lineItems.data[0]?.price?.id

    if (!priceId) {
      return NextResponse.json({ error: 'Article acheté non trouvé' }, { status: 404 })
    }

    // 3. Récupérer l'URL du PDF depuis Sanity
    const query = `*[_type == "issue" && stripePriceId == $priceId][0]{
      title,
      "pdfUrl": pdfFile.asset->url
    }`
    const numero = await client.fetch(query, { priceId: priceId })

    if (!numero || !numero.pdfUrl) {
      return NextResponse.json({ error: 'PDF non trouvé pour cet achat' }, { status: 404 })
    }

    // 4. Renvoyer l'URL au client
    return NextResponse.json({ downloadUrl: numero.pdfUrl, title: numero.title })

  } catch (error) {
    console.error('Erreur API Success:', error)
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 })
  }
}