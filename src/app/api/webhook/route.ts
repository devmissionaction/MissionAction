import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// ----- Initialisation Stripe -----
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

// Lecture du corps en raw pour la vérification de signature
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  // Lecture de la signature et du corps de la requête
  const sig = req.headers.get('stripe-signature')!
  let body: string
  try {
    body = await req.text()
  } catch (err) {
    console.error('Erreur de lecture du corps de la requête', err)
    return new Response('Could not read request body', { status: 400 })
  }

  // Vérification de l'événement Stripe
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Erreur signature Stripe', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // ----- Gestion des événements -----
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log(`Paiement réussi pour la session ${session.id}`)
    // Aucune action supplémentaire n'est requise ici car le téléchargement
    // est géré par la page de succès elle-même.
    // Vous pouvez ajouter d'autres logiques métier si nécessaire,
    // comme mettre à jour une base de données d'abonnés.
  }

  return NextResponse.json({ received: true })
}