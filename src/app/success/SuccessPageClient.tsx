'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SuccessPageClient() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      setError("Information de session manquante.")
      return
    }

    const fetchDownloadLink = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Impossible de vérifier votre achat.')
        }

        const data = await response.json()
        setDownloadUrl(data.downloadUrl)
        setTitle(data.title)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDownloadLink()
  }, [sessionId])

  const renderContent = () => {
    if (loading) {
      return <p className="text-lg">Vérification de votre achat en cours...</p>
    }

    if (error) {
      return <p className="text-lg text-red-500">Erreur : {error}</p>
    }

    if (downloadUrl) {
      return (
        <>
          <h1 className="text-4xl font-bold mb-4">Merci pour votre achat !</h1>
          <p className="text-lg mb-8">
            Vous pouvez télécharger votre numéro "{title}" dès maintenant.
          </p>
          <a
            href={downloadUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Télécharger le PDF
          </a>
          <p className="mt-4 text-sm text-gray-600">
            Un e-mail de confirmation vous a également été envoyé.
          </p>
        </>
      )
    }

    return <p>Une erreur inattendue est survenue.</p>
  }

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg">
      {renderContent()}
      <Link href="/" className="mt-8 inline-block text-blue-600 hover:underline">
        Retour à l'accueil
      </Link>
    </div>
  )
}