'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Link from 'next/link'
import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'


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
              className="relative block rounded-lg overflow-hidden shadow-lg group h-[32rem]" 
            >
              {issue.coverImage?.asset?.url && (
                <div className="w-full h-[32rem] relative"> 
                  <img
                    src={issue.coverImage.asset.url}
                    alt={issue.coverImage.alt || issue.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}


              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold px-4 text-center drop-shadow-lg">
                  {issue.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow hover:scale-110 transition z-10 cursor-pointer"
        aria-label="Précédent"
      >
        <FiChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow hover:scale-110 transition z-10 cursor-pointer"
        aria-label="Suivant"
      >
        <FiChevronRight className="w-6 h-6 text-gray-800" />
      </button>

    </div>
  )
}
