// /app/api/webhook/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Stripe from 'stripe'
import fs from 'fs'
import path from 'path'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' })
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Erreur signature Stripe', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_email

    //Exemple : on envoie le numéro-1.pdf à l'email
    const pdfBuffer = fs.readFileSync(path.join(process.cwd(), 'public/numero-1.pdf'))

    try {
      await resend.emails.send({
        from: 'revue@onresend.com',
        to: email!,
        subject: 'Merci pour votre achat !',
        html: `
          <div style="font-family: sans-serif;">
            <img src="https://mission-action.com/logo.svg" width="120" />
            <h1>Merci pour votre achat !</h1>
            <p>Vous trouverez votre numéro en pièce jointe.</p>
            <p>Bonne lecture,<br>Équipe Mission Action</p>
          </div>
        `,
        attachments: [
          {
            filename: 'MissionAction.pdf',
            content: pdfBuffer.toString('base64'),
          },
        ],
      })

      console.log(`Email envoyé à ${email}`)
    } catch (err) {
      console.error('Erreur envoi email', err)
    }
  }

  return NextResponse.json({ received: true })
}

