'use client'
import { FiShoppingCart } from 'react-icons/fi'

export default function BuyButton({ slug }: { slug: string }) {
  async function handleBuy() {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroSlug: slug }),
      })

      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url // redirection Stripe
      } else {
        alert('Erreur: ' + (data.error || 'Impossible de créer la session de paiement.'))
      }
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la connexion au serveur.')
    }
  }

  return (
    <button
      onClick={handleBuy}         
      className="group bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:cursor-pointer hover:shadow-md transition duration-300 transform hover:-translate-y-1 text-center flex flex-col items-center w-full"
    >
      <FiShoppingCart className="text-4xl text-gray-800 stroke-red-700 mb-4 group-hover:scale-110 transition-transform duration-300" />
      <h3 className="text-xl font-bold mb-2">Acheter ce numéro</h3>
      <p className="text-gray-500 text-sm">Version papier ou numérique à l’unité.</p>
    </button>
  )
}
