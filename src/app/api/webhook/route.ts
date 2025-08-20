import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Stripe from 'stripe'
import sanityClient from '@sanity/client'

// ----- Initialisation Stripe -----
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', // Assurez-vous que cette version est correcte
})

// ----- Initialisation Resend -----
const resend = new Resend(process.env.RESEND_API_KEY!)

// ----- Initialisation Sanity -----
const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2023-08-01',
  token: process.env.SANITY_API_TOKEN, // si lecture privée nécessaire
  useCdn: false,
})

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

  // ----- Gestion du paiement réussi -----
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_email

    if (!email) {
      console.error('Email du client non trouvé dans la session Stripe')
      return new Response('Customer email not found', { status: 400 })
    }

    // Récupérer le priceId de l'article acheté
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
    const priceIdFromStripe = lineItems.data[0]?.price?.id

    if (!priceIdFromStripe) {
      console.error('Pas de priceId trouvé pour cette session')
      return new Response('No priceId', { status: 400 })
    }

    // Requête Sanity pour récupérer le document correspondant
    const query = `*[_type == "numero" && priceId == $priceId][0]{
      title,
      "pdfUrl": pdf.asset->url
    }`
    const numero = await client.fetch(query, { priceId: priceIdFromStripe })

    if (!numero || !numero.pdfUrl) {
      console.error('Numéro ou URL du PDF non trouvé pour le priceId', priceIdFromStripe)
      return new Response('Numero or PDF URL not found', { status: 404 })
    }

    try {
      // Récupérer le contenu du PDF depuis Sanity
      const pdfResponse = await fetch(numero.pdfUrl)
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`)
      }
      const pdfBuffer = await pdfResponse.arrayBuffer()

      // Envoyer l'email avec Resend
      await resend.emails.send({
        from: 'revue@mission-action.com', // Domaine vérifié dans Resend
        to: email,
        subject: `Merci pour votre achat : ${numero.title}`,
        html: `
          <div style="font-family: sans-serif;">
            <h1>Merci pour votre achat !</h1>
            <p>Vous trouverez votre numéro "${numero.title}" en pièce jointe.</p>
          </div>
        `,
        attachments: [
          {
            filename: `${numero.title}.pdf`,
            content: Buffer.from(pdfBuffer),
          },
        ],
      })

      console.log(`Email envoyé à ${email} avec ${numero.title}`)
    } catch (err) {
      console.error('Erreur lors de la récupération du PDF ou de l\'envoi de l\'email', err)
      // On ne renvoie pas d'erreur au webhook Stripe pour ne pas bloquer le paiement
    }
  }

  return NextResponse.json({ received: true })
}
