import { client } from '@/lib/sanity'
import Link from 'next/link'

type NumeroPage = {
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

export default async function NumerosPage() {
  // Récupération de l'image hero
  const pageData: NumeroPage = await client.fetch(`
    *[_type == "numeroPage"][0]{
      heroImage {
        asset -> { url },
        alt
      }
    }
  `)

  // Récupération des numéros
  const issues: Issue[] = await client.fetch(`
    *[_type == "issue"] | order(_createdAt desc){
      _id,
      title,
      slug,
      coverImage {
        asset -> { url },
        alt
      }
    }
  `)

  return (
    <main>
      {pageData?.heroImage?.asset?.url && (
        <section className="w-full h-[70vh] min-h-[400px] relative">
          <img
            src={pageData.heroImage.asset.url}
            alt={pageData.heroImage.alt || 'Image de couverture'}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <h1 className="text-white font-bold text-center text-title">Nos numéros</h1>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Tous les numéros</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map((issue) => (
            <Link
              key={issue._id}
              href={`/numeros/${issue.slug.current}`}
              className="relative block rounded-lg overflow-hidden shadow-lg group h-96"
            >
              {issue.coverImage?.asset?.url && (
                <div className="w-full h-full relative">
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
          ))}
        </div>
      </section>
    </main>
  )
}
