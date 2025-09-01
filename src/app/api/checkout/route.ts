import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/lib/sanity'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(req: Request) {
  try {
    const { numeroSlug } = await req.json()

    // --- CORRECTION ICI ---
    // Utiliser "stripePriceId" pour correspondre au schéma Sanity
    const numero = await client.fetch(
      `*[_type == "issue" && slug.current == $slug][0]{
        title,
        stripePriceId 
      }`,
      { slug: numeroSlug }
    )

    if (!numero || !numero.stripePriceId) {
      console.error('Numéro introuvable ou stripePriceId manquant pour le slug:', numeroSlug);
      return NextResponse.json({ error: 'Numéro introuvable ou sans priceId' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: numero.stripePriceId, // Utiliser la variable correcte
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/annule`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Erreur Stripe Checkout:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}