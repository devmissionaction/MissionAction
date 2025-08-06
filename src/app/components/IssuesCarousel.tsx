'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Link from 'next/link'
import { useState } from 'react'

type Issue = {
  _id: string
  title: string
  slug: { current: string }
  coverImage?: {
    asset: {
      url: string
    }
    alt?: string
  }
}

export function IssuesCarousel({ issues }: { issues: Issue[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2.2, spacing: 24 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3.2, spacing: 32 },
      },
    },
  })

  return (
    <div className="relative">
      {/* Carrousel */}
      <div ref={sliderRef} className="keen-slider">
        {issues.map((issue) => (
          <div key={issue._id} className="keen-slider__slide">
            <Link
              href={`/numeros/${issue.slug.current}`}
              className="relative block rounded-lg overflow-hidden shadow-lg group h-96"
            >
              {issue.coverImage?.asset?.url && (
                <div className="w-full h-96 relative">
                  <img
                    src={issue.coverImage.asset.url}
                    alt={issue.coverImage.alt || issue.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

              )}

              {/* Overlay assombrissant */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Titre par-dessus */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold px-4 text-center drop-shadow-lg">
                  {issue.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Boutons de navigation */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-105 transition z-10"
        aria-label="Précédent"
      >
        ◀
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-105 transition z-10"
        aria-label="Suivant"
      >
        ▶
      </button>
    </div>
  )
}
