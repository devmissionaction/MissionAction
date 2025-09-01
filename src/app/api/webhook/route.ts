import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Stripe from 'stripe'
// On utilise le serverClient comme discuté précédemment
import { serverClient } from '@/lib/sanity' 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' });
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  // ... (tout le code de vérification de la signature Stripe reste identique) ...
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

    // --- MODIFICATION 1 ---
    // On récupère l'ID directement depuis les métadonnées
    const sanityDocumentId = session.metadata?.sanityDocumentId;

    if (!sanityDocumentId) {
      console.error("ERREUR: sanityDocumentId non trouvé dans les métadonnées de la session Stripe.");
      return new Response('Metadata manquant', { status: 400 });
    }

    // --- MODIFICATION 2 ---
    // La requête est maintenant beaucoup plus simple et fiable
    const query = `*[_id == $id][0]{
      title,
      "pdfUrl": pdf.asset->url
    }`;

    try {
      const numero = await serverClient.fetch(query, { id: sanityDocumentId });

      if (!numero || !numero.pdfUrl) {
        console.error(`ÉCHEC: Aucun document trouvé pour l'ID Sanity: ${sanityDocumentId}`);
        return new Response('Document Sanity non trouvé', { status: 404 });
      }

      console.log(`SUCCÈS: Numéro "${numero.title}" trouvé via son ID.`);
      
      // ... (le reste du code pour envoyer l'email avec Resend reste identique) ...
      const email = session.customer_details?.email;
      if (email) {
        // Logique d'envoi d'email
      }
      
    } catch (err) {
      console.error("Erreur lors du fetch Sanity par ID:", err);
      return new Response('Erreur interne', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}