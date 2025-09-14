// src/app/success/SuccessClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessClient() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [pdfUrl, setPdfUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionId) {
      async function fetchPdfUrl() {
        try {
          const response = await fetch(`/api/download?session_id=${sessionId}`)
          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Erreur lors de la récupération du PDF')
          }
          setPdfUrl(data.pdfUrl)
        } catch (err: any) {
          setError(err.message)
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      fetchPdfUrl()
    } else {
      setLoading(false)
      setError("Numéro de session introuvable.")
    }
  }, [sessionId])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Merci pour votre achat ! 🎉</h1>
      {loading && <p>Chargement du lien de téléchargement...</p>}
      {error && <p className="text-red-500">Erreur : {error}</p>}
      {pdfUrl && (
        <>
          <p className="mb-6">
            Votre achat a été finalisé avec succès. Vous pouvez télécharger votre numéro en cliquant sur le bouton ci-dessous.
          </p>
          <Link
            href={pdfUrl}
            target="_blank"
            download
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Télécharger le PDF
          </Link>
        </>
      )}
    </main>
  )
}