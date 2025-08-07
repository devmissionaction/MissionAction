'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AcheterNumeroClient({ slug }: { slug: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!

  const handleCheckout = async () => {
    if (!email) {
      alert('Veuillez renseigner votre adresse email.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, email }),
    })

    if (res.ok) {
      const { url } = await res.json()
      router.push(url)
    } else {
      alert('Erreur lors du paiement.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Acheter le numéro : {slug}</h1>
        <p className="mb-4 text-gray-600">
          Entrez votre adresse email. Vous recevrez le numéro PDF après le paiement.
        </p>

        <input
          type="email"
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-4 py-2 mb-4"
          required
        />

        <button
          onClick={handleCheckout}
          disabled={loading || !email}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-default w-full cursor-pointer"
        >
          {loading ? 'Redirection vers Stripe...' : 'Payer maintenant'}
        </button>
      </div>
    </main>
  )
}
