import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/lib/sanity'

// Initialisation Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(req: Request) {
  try {
    const { numeroSlug } = await req.json()

    // Récupérer le numéro depuis Sanity
    const numero = await client.fetch(
      `*[_type == "issue" && slug.current == $slug][0]{
        title,
        stripePriceId
      }`,
      { slug: numeroSlug }
    )

    if (!numero || !numero.stripePriceId) {
      return NextResponse.json({ error: 'Numéro introuvable ou sans priceId' }, { status: 400 })
    }

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: numero.stripePriceId, // récupéré depuis Sanity
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/annule`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Erreur Stripe:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
