import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/lib/sanity'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(req: Request) {
  try {
    const { numeroSlug } = await req.json()

    // --- MODIFICATION 1 ---
    // On récupère TOUT ce dont on aura besoin plus tard
    const numero = await client.fetch(
      `*[_type == "issue" && slug.current == $slug][0]{
        title,
        stripePriceId,
        "pdfUrl": pdf.asset->url // On récupère l'URL complète du PDF
      }`,
      { slug: numeroSlug }
    )

    if (!numero || !numero.stripePriceId || !numero.pdfUrl) {
      return NextResponse.json({ error: 'Données du numéro incomplètes' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
          price: numero.stripePriceId,
          quantity: 1,
      }],
      // --- MODIFICATION 2 ---
      // On stocke toutes les infos nécessaires dans les métadonnées
      metadata: {
        issueTitle: numero.title,
        pdfUrl: numero.pdfUrl,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/annule`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Erreur Stripe Checkout:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}