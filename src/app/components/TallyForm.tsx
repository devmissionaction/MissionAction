'use client'

import { useEffect, useState, useRef } from 'react'

const TALLY_SCRIPT_SRC = 'https://tally.so/widgets/embed.js'

type TallyFormProps = {
  formId: string
}

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void
    }
  }
}

export function TallyForm({ formId }: TallyFormProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!formId) {
      setIsLoading(false)
      return
    }

    const fallbackTimer = setTimeout(() => setIsLoading(false), 8000)

    const loadTallyEmbeds = () => {
      if (typeof window.Tally !== 'undefined') {
        window.Tally.loadEmbeds()
        return
      }
      document
        .querySelectorAll('iframe[data-tally-src]:not([src])')
        .forEach((iframeEl) => {
          const el = iframeEl as HTMLIFrameElement
          if (el.dataset.tallySrc) el.src = el.dataset.tallySrc
        })
    }

    const handleFormLoaded = (e: MessageEvent) => {
      if (e?.data?.includes?.('Tally.FormLoaded')) {
        try {
          const payload = JSON.parse(e.data).payload as { formId: string }
          if (payload?.formId === formId) {
            setIsLoading(false)
          }
        } catch {
          setIsLoading(false)
        }
      }
    }

    const handleFormSubmitted = (e: MessageEvent) => {
      if (e?.data?.includes?.('Tally.FormSubmitted')) {
        try {
          const payload = JSON.parse(e.data).payload as { formId?: string }
          if (payload?.formId === formId) {
            setIsSubmitted(true)
          }
        } catch {
          // ignorer les erreurs de parsing
        }
      }
    }

    window.addEventListener('message', handleFormLoaded)
    window.addEventListener('message', handleFormSubmitted)

    // Vérification simplifiée du script existant
    if (typeof window.Tally !== 'undefined' || document.querySelector(`script[src="${TALLY_SCRIPT_SRC}"]`)) {
      loadTallyEmbeds()
    } else {
      const script = document.createElement('script')
      script.src = TALLY_SCRIPT_SRC
      script.async = true
      script.onload = loadTallyEmbeds
      script.onerror = () => {
        loadTallyEmbeds()
        setIsLoading(false)
      }
      document.body.appendChild(script)
    }

    return () => {
      clearTimeout(fallbackTimer)
      window.removeEventListener('message', handleFormLoaded)
      window.removeEventListener('message', handleFormSubmitted)
    }
  }, [formId])

  if (!formId) return null

  if (isSubmitted) {
    return (
      <div className="w-full flex justify-center px-4 py-8">
        <div className="w-full max-w-2xl rounded-xl bg-green-50 border border-green-200 p-8 sm:p-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4" aria-hidden>
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">Formulaire envoyé</h2>
          <p className="text-green-700">
            Merci ! Votre inscription a bien été enregistrée.
          </p>
        </div>
      </div>
    )
  }

  const embedUrl = `https://tally.so/embed/${formId}?hideTitle=1&dynamicHeight=1&transparentBackground=1`

  return (
    <div className="w-full flex justify-center px-4 py-8">
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl min-h-[320px]"
      >
        {isLoading && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50 rounded-lg"
            aria-hidden="true"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Chargement du formulaire…</span>
            </div>
          </div>
        )}
        
        {/* Ajout d'une classe CSS globale pour cacher la scrollbar sur Webkit si besoin */}
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        <iframe
          data-tally-src={embedUrl}
          data-tally-iframe-auto-height="true"
          title="Formulaire Tally"
          className="w-full border-0 rounded-lg no-scrollbar" // Ajout de la classe no-scrollbar
          style={{ 
            width: '100%', 
            minHeight: '320px', 
            // Ces propriétés forcent le masquage des barres de défilement
            overflow: 'hidden',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none'  // IE/Edge
          }}
          loading="lazy"
        />
      </div>
    </div>
  )
}