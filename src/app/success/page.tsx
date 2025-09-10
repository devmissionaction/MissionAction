import { Suspense } from 'react'
import SuccessPageClient from './SuccessPageClient'

// Un composant simple pour le chargement
function LoadingState() {
  return (
    <div className="bg-white p-10 rounded-xl shadow-lg">
      <p className="text-lg">Vérification de votre achat en cours...</p>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 p-4">
      <Suspense fallback={<LoadingState />}>
        <SuccessPageClient />
      </Suspense>
    </div>
  )
}