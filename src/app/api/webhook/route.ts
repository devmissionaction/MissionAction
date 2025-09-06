import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Stripe from 'stripe'
// Sanity n'est plus nécessaire ici !

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' });
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  // ... (le code de vérification de la signature Stripe reste le même) ...
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // --- MODIFICATION PRINCIPALE ---
    // On récupère les infos directement depuis les métadonnées
    const issueTitle = session.metadata?.issueTitle;
    const pdfUrl = session.metadata?.pdfUrl;
    const email = session.customer_details?.email;

    if (!issueTitle || !pdfUrl || !email) {
      console.error("ERREUR: Informations manquantes dans les métadonnées de la session Stripe.", session.id);
      return new Response('Métadonnées ou email manquants', { status: 400 });
    }

    try {
      console.log(`Préparation de l'envoi pour: ${issueTitle} à ${email}`);

      // On récupère le PDF depuis l'URL stockée
      const pdfResponse = await fetch(pdfUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Échec de la récupération du PDF: ${pdfResponse.statusText}`);
      }
      
      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

      // On envoie l'email
      await resend.emails.send({
        from: 'revue@mission-action.com',
        to: email,
        subject: `Votre achat : ${issueTitle}`,
        html: `<p>Merci pour votre achat ! Vous trouverez votre numéro "${issueTitle}" en pièce jointe.</p>`,
        attachments: [{
            filename: `${issueTitle}.pdf`,
            content: pdfBase64,
        }],
      });

      console.log(`Email envoyé avec succès à ${email}`);

    } catch (err) {
      console.error("Erreur lors de la récupération du PDF ou de l'envoi de l'email:", err);
      return new Response('Erreur interne', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}