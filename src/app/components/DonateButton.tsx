'use client'

import { useState } from 'react'
import { FiHeart } from 'react-icons/fi'

const PRESET_AMOUNTS = [
  { label: '5 €', value: 500 },
  { label: '10 €', value: 1000 },
  { label: '20 €', value: 2000 },
  { label: '50 €', value: 5000 },
]

export default function DonateButton() {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000) // 10€ par défaut
  const [loading, setLoading] = useState(false)

  async function handleDonate() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountInCents: selectedAmount }),
      })

      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur : ' + (data.error || 'Impossible de créer la session de paiement.'))
      }
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la connexion au serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {PRESET_AMOUNTS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelectedAmount(value)}
            className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
              selectedAmount === value
                ? 'border-red-700 bg-red-50 text-red-800'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleDonate}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold px-8 py-4 rounded hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        <FiHeart className="text-xl" aria-hidden />
        {loading ? 'Redirection vers Stripe...' : `Faire un don de ${selectedAmount / 100} €`}
      </button>
    </div>
  )
}
