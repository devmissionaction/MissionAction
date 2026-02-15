'use client'

import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { FiCalendar, FiUsers, FiEdit3 } from 'react-icons/fi'

type FestivalPageData = {
  heroImage?: {
    asset: { url: string }
    alt?: string
  }
  introduction?: PortableTextBlock[]
  poster?: {
    asset: { url: string }
    alt?: string
  }
  programme?: PortableTextBlock[]
  inscriptionUrl?: string
  inscriptionLabel?: string
}

type FestivalPartner = {
  _id: string
  name: string
  logo?: {
    asset: { url: string }
  }
  url?: string
  order?: number
}

export default function FestivalPageClient({
  data,
  partners,
}: {
  data: FestivalPageData
  partners: FestivalPartner[]
}) {
  return (
    <main>
      {/* HERO */}
      {data?.heroImage?.asset?.url ? (
        <section className="w-full h-[70vh] min-h-[400px] relative">
          <img
            src={data.heroImage.asset.url}
            alt={data.heroImage.alt || 'Le Festival'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <h1 className="text-white text-4xl sm:text-5xl font-bold text-center text-title">
              Le Festival
            </h1>
          </div>
        </section>
      ) : (
        <section className="w-full h-[50vh] min-h-[280px] bg-gray-800 flex items-center justify-center">
          <h1 className="text-white text-4xl sm:text-5xl font-bold text-center text-title">
            Le Festival
          </h1>
        </section>
      )}

      {/* PRÉSENTATION + AFFICHE */}
      <section className="bg-[#fdfcf9] py-16 sm:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="prose prose-lg max-w-none">
              {data?.introduction && data.introduction.length > 0 ? (
                <PortableText value={data.introduction} />
              ) : (
                <p className="text-gray-600">
                  Présentation du festival à venir. Ce texte est éditable depuis Sanity.
                </p>
              )}
            </div>
            <div className="flex justify-center lg:justify-end">
              {data?.poster?.asset?.url ? (
                <img
                  src={data.poster.asset.url}
                  alt={data.poster.alt || 'Affiche du festival'}
                  className="w-full max-w-md rounded-lg shadow-xl object-cover"
                />
              ) : (
                <div className="w-full max-w-md aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  Affiche à venir
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMME */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 flex items-center justify-center gap-3">
            Programme
          </h2>
          <div className="prose prose-lg max-w-none mt-8">
            {data?.programme && data.programme.length > 0 ? (
              <PortableText value={data.programme} />
            ) : (
              <p className="text-gray-600 text-center">
                Le programme sera bientôt disponible. Vous pouvez le renseigner depuis Sanity.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* PARTENAIRES */}
      {partners.length > 0 && (
        <section className="py-16 sm:py-24 px-6 bg-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 flex items-center justify-center gap-3">
              <FiUsers className="text-red-700" aria-hidden />
              Partenaires
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Ils nous font confiance pour faire vivre le festival.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center">
              {partners.map((partner) => (
                <li key={partner._id} className="flex flex-col items-center gap-2">
                  {partner.url ? (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 hover:opacity-80 transition"
                    >
                      {partner.logo?.asset?.url ? (
                        <img
                          src={partner.logo.asset.url}
                          alt={partner.name}
                          className="max-h-20 w-auto object-contain"
                        />
                      ) : (
                        <span className="font-semibold text-gray-700 text-center">
                          {partner.name}
                        </span>
                      )}
                    </a>
                  ) : (
                    <>
                      {partner.logo?.asset?.url ? (
                        <img
                          src={partner.logo.asset.url}
                          alt={partner.name}
                          className="max-h-20 w-auto object-contain"
                        />
                      ) : (
                        <span className="font-semibold text-gray-700 text-center">
                          {partner.name}
                        </span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* INSCRIPTION */}
      <section className="py-16 sm:py-24 px-6 bg-[#fdfcf9]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <FiEdit3 className="text-red-700" aria-hidden />
            Inscription
          </h2>
          <p className="text-gray-600 mb-8">
            Réservez votre place au festival en vous inscrivant en ligne.
          </p>
          {data?.inscriptionUrl ? (
            <a
              href={data.inscriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white font-bold px-8 py-4 rounded hover:bg-gray-800 transition navbar-text"
            >
              {data.inscriptionLabel || "S'inscrire en ligne"}
            </a>
          ) : (
            <p className="text-gray-500 text-sm">
              Lien d’inscription à configurer dans Sanity (festivalPage → inscriptionUrl).
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
