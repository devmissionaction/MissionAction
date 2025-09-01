import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Uniquement pour le débogage, on simplifie au maximum
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  // --- LOG N°1 : Est-ce que la fonction est même appelée ? ---
  console.log(">>> [WEBHOOK DÉBUT] Requête reçue par /api/webhook.");

  const sig = req.headers.get('stripe-signature');
  let body: string;
  try {
    body = await req.text();
  } catch (err) {
    console.error(">>> [WEBHOOK ERREUR] Impossible de lire le corps de la requête.", err);
    return new Response('Could not read request body', { status: 400 });
  }
  
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    // --- LOG N°2 : Est-ce que les secrets sont bien chargés ? ---
    console.error(">>> [WEBHOOK ERREUR] Signature ou secret manquant. Vérifiez les variables d'environnement sur Vercel !");
    return new Response('Webhook secret not configured', { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // --- LOG N°3 : La signature est-elle valide ? ---
    console.log(`>>> [WEBHOOK SUCCÈS] Événement vérifié avec succès: ${event.type}`);

  } catch (err: any) {
    // --- LOG N°4 : POINT DE CRASH LE PLUS PROBABLE ---
    console.error(`>>> [WEBHOOK ERREUR SIGNATURE] Échec de la vérification : ${err.message}`);
    console.error(">>> Cause probable : Le 'STRIPE_WEBHOOK_SECRET' sur Vercel ne correspond pas à celui du Dashboard Stripe.");
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Si on arrive jusqu'ici, la connexion Stripe <> Vercel est BONNE.
  // On peut ajouter le reste de la logique après.
  if (event.type === 'checkout.session.completed') {
    console.log(">>> [WEBHOOK INFO] Session de paiement terminée. Traitement en cours...");
    // Ici, vous remettriez votre logique Sanity et Resend.
  }

  return NextResponse.json({ received: true });
}