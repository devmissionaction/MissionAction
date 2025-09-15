// src/app/videos/page.tsx
import { client } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
// Correction ici : l'importation du type vient d'un sous-chemin
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import imageUrlBuilder from '@sanity/image-url'

// Définition des types de données
interface Video {
  _id: string
  title: string
  link: string
  coverImage: SanityImageSource
}

interface VideosPageData {
  title: string
  description: string
  heroImage: SanityImageSource
}

// Configuration du builder d'URL d'image
const builder = imageUrlBuilder(client)

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Fonctions de récupération des données
async function getVideos() {
  const query = `*[_type == "video"] | order(_createdAt desc){
    _id,
    title,
    link,
    coverImage
  }`
  const videos = await client.fetch(query)
  return videos as Video[]
}

async function getVideosPageData() {
  const query = `*[_type == "videosPage"][0]{
    title,
    description,
    heroImage
  }`
  const data = await client.fetch(query)
  return data as VideosPageData
}

export const revalidate = 60

export default async function VideosPage() {
  const [videos, videosPageData] = await Promise.all([
    getVideos(),
    getVideosPageData()
  ])

  return (
    <main>
      {/* Section Hero */}
      {videosPageData && (
        <header className="relative w-full h-96 md:h-[500px] flex items-center justify-center text-center">
          <Image
            src={urlFor(videosPageData.heroImage).url()}
            alt={videosPageData.title}
            fill
            priority
            sizes="100vw"
            className="object-cover absolute inset-0"
          />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white text-shadow-lg">
              {videosPageData.title}
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-white text-shadow-md">
              {videosPageData.description}
            </p>
          </div>
        </header>
      )}

      {/* Contenu principal avec la grille de vidéos */}
      <section className="container mx-auto p-4 md:p-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link
              key={video._id}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={urlFor(video.coverImage).width(500).height(500).url()}
                  alt={`Couverture de la vidéo : ${video.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-white dark:bg-gray-800">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:underline">
                  {video.title}
                </h2>
              </div>
            </Link>
          ))}
          {videos.length === 0 && (
            <p className="text-center col-span-full text-gray-500">
              Aucune vidéo n'est disponible pour le moment. Revenez bientôt !
            </p>
          )}
        </div>
      </section>
    </main>
  )
}