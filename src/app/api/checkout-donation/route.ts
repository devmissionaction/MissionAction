import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
})

const CURRENCY = (process.env.STRIPE_CURRENCY as string) || 'eur'
const MIN_AMOUNT_CENTS = 100 // 1€ minimum

export async function POST(req: Request) {
  try {
    const { amountInCents } = await req.json()

    const amount = Number(amountInCents)
    if (!Number.isInteger(amount) || amount < MIN_AMOUNT_CENTS) {
      return NextResponse.json(
        { error: `Montant invalide. Minimum : ${MIN_AMOUNT_CENTS / 100} €` },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: 'Don au festival Mission Action',
              description: 'Votre don soutient le festival et l’association.',
              images: process.env.NEXT_PUBLIC_LOGO_URL
                ? [process.env.NEXT_PUBLIC_LOGO_URL]
                : undefined,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/festival?donation=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/festival`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Erreur Stripe donation:', err)
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
