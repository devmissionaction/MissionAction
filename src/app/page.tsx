import { client } from '@/lib/sanity'
import { IssuesCarousel } from './components/IssuesCarousel'

type HomePage = {
  heroImage: {
    asset: {
      url: string
    }
    alt?: string
  }
}

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

export default async function HomePage() {
  const home: HomePage = await client.fetch(`*[_type == "homePage"][0]{
    heroImage {
      asset -> {
        url
      },
      alt
    }
  }`)

  const issues: Issue[] = await client.fetch(`*[_type == "issue"] | order(_createdAt desc)[0...6]{
    _id,
    title,
    slug,
    coverImage {
      asset -> {
        url
      },
      alt
    }
  }`)

  return (
    <main>
      {/* HERO en plein écran */}
      <section className="w-full h-screen relative">
        {home?.heroImage?.asset?.url && (
          <img
            src={home.heroImage.asset.url}
            alt={home.heroImage.alt || 'Image accueil'}
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1
            className="text-white text-5xl sm:text-6xl font-bold text-center"
            style={{ fontFamily: 'Gotham Bold Italic, sans-serif' }}
          >
            Mission Action
          </h1>
        </div>
      </section>

      {/* SECTION CARROUSEL en plein écran */}
      <section className="w-full h-screen flex flex-col justify-center px-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">Nos derniers numéros</h2>
        <IssuesCarousel issues={issues} />
      </section>
    </main>
  )
}
