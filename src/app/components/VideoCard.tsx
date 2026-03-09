'use client'

import { useState } from 'react'
import Link from 'next/link'

type VideoCardProps = {
  video: {
    _id: string
    title: string
    link: string
    coverImage?: {
      asset: {
        url: string
      }
    }
  }
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const coverImageUrl = video.coverImage?.asset?.url
  const isGif = coverImageUrl?.toLowerCase().endsWith('.gif')

  return (
    <Link
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block rounded-lg overflow-hidden shadow-lg group h-96"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {coverImageUrl && (
        <div className="w-full h-full relative">
          {/* Image statique (premier frame) - toujours affichée */}
          {isGif && (
            <img
              src={`${coverImageUrl}?frame=0`}
              alt={video.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}
          {/* GIF animé - affiché au hover */}
          <img
            src={isGif ? `${coverImageUrl}?t=${Date.now()}` : coverImageUrl}
            alt={video.title}
            key={isHovered ? 'animated' : 'static'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isGif ? (isHovered ? 'opacity-100' : 'opacity-0') : 'opacity-100'
            }`}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-white text-2xl font-semibold px-4 text-center drop-shadow-lg">
          {video.title}
        </h3>
      </div>
    </Link>
  )
}
