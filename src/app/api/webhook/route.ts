import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Stripe from 'stripe'
import { client } from '@/lib/sanity' // Assurez-vous que ce client utilise useCdn: false

// Initialisation de Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', 
});

// Initialisation de Resend avec la clé API
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
    console.error("La signature Stripe ou le secret du webhook est manquant.");
    return new Response('Webhook secret not configured', { status: 500 });
  }

  let event: Stripe.Event;

  // Vérification de la signature du webhook pour la sécurité
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

  // Gestion de l'événement de paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;

    if (!email) {
      console.error("Email du client non trouvé dans la session Stripe:", session.id);
      // On retourne une réponse 200 pour que Stripe ne réessaie pas, car l'email est manquant.
      return new Response('Customer email not found in session, but acknowledging event.', { status: 200 });
    }

    // Récupération du priceId depuis les line items de la session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    const priceIdFromStripe = lineItems.data[0]?.price?.id;

    if (!priceIdFromStripe) {
      console.error("Aucun Price ID trouvé dans les line items pour la session:", session.id);
      return new Response('Price ID not found in line items', { status: 400 });
    }

    // Requête Sanity pour trouver le document correspondant avec le bon nom de champ
    const query = `*[_type == "issue" && stripePriceId == $priceId][0]{
      title,
      "pdfUrl": pdf.asset->url
    }`;

    try {
      const numero = await client.fetch(query, { priceId: priceIdFromStripe });

      if (!numero || !numero.pdfUrl) {
        console.error(`Webhook: Numéro ou URL du PDF non trouvé pour le stripePriceId: ${priceIdFromStripe}`);
        return new Response('Numero or PDF URL not found', { status: 404 });
      }

      console.log(`PDF trouvé pour ${numero.title}. URL: ${numero.pdfUrl}`);

      // Récupération du fichier PDF depuis l'URL Sanity
      const pdfResponse = await fetch(numero.pdfUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Échec de la récupération du PDF: ${pdfResponse.statusText}`);
      }
      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

      // Envoi de l'email avec Resend
      await resend.emails.send({
        from: 'revue@mission-action.com', // Remplacez par votre email d'envoi configuré
        to: email,
        subject: `Votre achat : ${numero.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Merci pour votre commande !</h2>
            <p>Bonjour,</p>
            <p>Vous trouverez en pièce jointe votre exemplaire du numéro "${numero.title}".</p>
            <p>Bonne lecture !</p>
            <p>L'équipe Mission Action</p>
          </div>
        `,
        attachments: [
          {
            filename: `${numero.title.replace(/ /g, '_')}.pdf`,
            content: pdfBase64,
          },
        ],
      });

      console.log(`Email de confirmation envoyé avec succès à ${email} pour le numéro ${numero.title}.`);

    } catch (err) {
      console.error("Une erreur est survenue lors du traitement du webhook:", err);
      // En cas d'erreur interne, on peut vouloir que Stripe réessaie.
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // Réponse de succès à Stripe pour accuser réception de l'événement
  return NextResponse.json({ received: true });
}