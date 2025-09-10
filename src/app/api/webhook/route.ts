import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Stripe from 'stripe'
import { client } from '@/lib/sanity' 

// ----- Initialisation Stripe -----
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', 
})

// ----- Initialisation Resend -----
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  let body: string
  try {
    body = await req.text()
  } catch (err) {
    console.error('Erreur de lecture du corps de la requête', err)
    return new Response('Could not read request body', { status: 400 })
  }

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email

    if (!email) {
      console.error('Email du client non trouvé dans la session Stripe')
      return new Response('Customer email not found', { status: 400 })
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
    const priceIdFromStripe = lineItems.data[0]?.price?.id

    if (!priceIdFromStripe) {
      console.error('Pas de priceId trouvé pour cette session')
      return new Response('No priceId', { status: 400 })
    }

    const query = `*[_type == "issue" && stripePriceId == $priceId][0]{
      title,
      "pdfUrl": pdfFile.asset->url
    }`
    const numero = await client.fetch(query, { priceId: priceIdFromStripe })

    if (!numero || !numero.pdfUrl) {
      console.error('Numéro ou URL du PDF non trouvé pour le priceId', priceIdFromStripe)
      return new Response('Numero or PDF URL not found', { status: 404 })
    }

    try {
      const pdfResponse = await fetch(numero.pdfUrl)
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`)
      }
      const pdfBuffer = await pdfResponse.arrayBuffer()

      await resend.emails.send({
        from: 'contact@mission-action.com', // Remplacez par votre email vérifié sur Resend
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
    }
  }

  return NextResponse.json({ received: true })
}