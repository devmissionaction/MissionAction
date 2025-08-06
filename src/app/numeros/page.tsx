import { client } from '@/lib/sanity'
import Link from 'next/link'

type Issue = {
  _id: string
  title: string
  slug: { current: string }
  coverImage?: {
    asset: { url: string }
    alt?: string
  }
}

export default async function NumerosPage() {
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
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-12 text-center">Tous les numéros</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {issues.map((issue) => (
          <Link
            key={issue._id}
            href={`/numeros/${issue.slug.current}`}
            className="relative block rounded-lg overflow-hidden shadow-lg group h-96"
          >
            {/* Image de fond */}
            {issue.coverImage?.asset?.url && (
              <div className="w-full h-full relative">
                <img
                  src={issue.coverImage.asset.url}
                  alt={issue.coverImage.alt || issue.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Titre centré */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-2xl font-semibold px-4 text-center drop-shadow-lg">
                {issue.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
