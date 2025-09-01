import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Stripe from 'stripe'
import { client } from '@/lib/sanity'
import { serverClient } from '@/lib/sanity' // <-- IMPORT MODIFIÉ

// Initialisation des clients
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  let body: string;
  try {
    body = await req.text();
  } catch (err) {
    console.error("Erreur de lecture du corps de la requête", err);
    return new Response('Could not read request body', { status: 400 });
  }

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Secret du webhook ou signature manquante.");
    return new Response('Webhook secret not configured', { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Erreur de vérification de la signature Stripe: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Si l'événement est un paiement réussi, on continue
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Récupération du priceId depuis la session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    const priceIdFromStripe = lineItems.data[0]?.price?.id;

    // --- LOG DE DÉBOGAGE CRUCIAL ---
    // Cette ligne va nous montrer l'ID exact que nous devons vérifier dans Sanity.
    console.log(`ID de prix reçu par Stripe: ${priceIdFromStripe}`);

    if (!priceIdFromStripe) {
      console.error("Aucun Price ID trouvé pour la session:", session.id);
      return new Response('Price ID not found', { status: 400 });
    }

    // Requête Sanity pour trouver le document correspondant
    const query = `*[_type == "issue" && stripePriceId == $priceId][0]{
      title,
      "pdfUrl": pdf.asset->url
    }`;

    try {
      const numero = await serverClient.fetch(query, { priceId: priceIdFromStripe });

      // C'est ici que l'erreur 404 se produisait.
      if (!numero || !numero.pdfUrl) {
        console.error(`ÉCHEC de la recherche Sanity: Aucun numéro trouvé avec le stripePriceId: ${priceIdFromStripe}`);
        return new Response('Numero or PDF URL not found', { status: 404 });
      }

      console.log(`SUCCÈS de la recherche Sanity: Numéro "${numero.title}" trouvé.`);
      
      const email = session.customer_details?.email;
      if (!email) {
        console.error("Email du client non trouvé:", session.id);
        return new Response('Customer email not found', { status: 200 });
      }

      // Récupération et envoi du PDF par email
      const pdfResponse = await fetch(numero.pdfUrl);
      if (!pdfResponse.ok) throw new Error(`Échec de la récupération du PDF: ${pdfResponse.statusText}`);
      
      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

      await resend.emails.send({
        from: 'revue@mission-action.com',
        to: email,
        subject: `Votre achat : ${numero.title}`,
        html: `<p>Merci pour votre achat ! Vous trouverez votre numéro "${numero.title}" en pièce jointe.</p>`,
        attachments: [{
            filename: `${numero.title}.pdf`,
            content: pdfBase64,
        }],
      });

      console.log(`Email envoyé avec succès à ${email} pour le numéro ${numero.title}.`);

    } catch (err) {
      console.error("Erreur lors du traitement Sanity ou Resend:", err);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}