import { client } from '@/lib/sanity'
import Link from 'next/link'

type VideosPageData = {
  heroImage: {
    asset: {
      url: string
    }
    alt?: string
  }
}

type Video = {
  _id: string
  title: string
  link: string
  coverImage?: {
    asset: {
      url: string
    }
    alt?: string
  }
}

export const revalidate = 60

export default async function VideosPage() {
  // Récupération de l'image hero et des vidéos en parallèle
  const [videosPageData, videos] = await Promise.all([
    client.fetch<VideosPageData>(`
      *[_type == "videosPage"][0]{
        heroImage {
          asset -> { url },
          alt
        }
      }
    `),
    client.fetch<Video[]>(`
      *[_type == "video"] | order(_createdAt desc){
        _id,
        title,
        link,
        coverImage {
          asset -> { url },
          alt
        }
      }
    `)
  ])

  return (
    <main>
      {/* Section Hero */}
      {videosPageData?.heroImage?.asset?.url && (
        <section className="w-full h-[70vh] min-h-[400px] relative">
          <img
            src={videosPageData.heroImage.asset.url}
            alt={videosPageData.heroImage.alt || 'Image de couverture'}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <h1 className="text-white font-bold text-center text-title">
              Programme vidéo
            </h1>
          </div>
        </section>
      )}

      {/* Contenu principal avec la grille de vidéos */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Toutes les vidéos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Link
              key={video._id}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block rounded-lg overflow-hidden shadow-lg group h-96"
            >
              {video.coverImage?.asset?.url && (
                <div className="w-full h-full relative">
                  <img
                    src={video.coverImage.asset.url}
                    alt={video.coverImage.alt || video.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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