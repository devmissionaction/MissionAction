import { client } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

type Article = {
  _id: string
  title: string
  slug: { current: string }
  type: 'free' | 'paid'
  mainImage?: {
    asset: { url: string }
  }
}

type Issue = {
  title: string
  description?: PortableTextBlock[]
  coverImage?: { asset: { url: string } }
  articles?: Article[]
}

type Params = {
  params: {
    slug: string
  }
}

export default async function NumeroPage({ params }: Params) {
  const slug = params.slug

  const issue: Issue = await client.fetch(
    `*[_type == "issue" && slug.current == $slug][0]{
      title,
      description,
      coverImage {
        asset -> { url }
      },
      articles[]->{
        _id,
        title,
        slug,
        type,
        mainImage {
          asset -> { url }
        }
      }
    }`,
    { slug }
  )

  if (!issue) return <div className="p-6">Numéro introuvable.</div>

  return (
    <main>
      {/* Section 1 - Présentation du numéro */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 p-8 max-w-6xl mx-auto">
        {issue.coverImage?.asset?.url && (
          <img
            src={issue.coverImage.asset.url}
            alt={`Couverture du numéro ${issue.title}`}
            className="w-full md:w-1/2 max-w-md object-cover rounded-lg shadow-lg"
          />
        )}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">{issue.title}</h1>
          {issue.description && (
            <div className="prose prose-lg max-w-none">
              <PortableText value={issue.description} />
            </div>
          )}
        </div>
      </section>

      {/* Section 2 - Galerie de liens */}
      <section className="h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
        <h2 className="text-3xl font-bold mb-12">Accès au contenu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {/* Article gratuit */}
          <a
            href={`/articles/${issue.articles?.find((a) => a.type === 'free')?.slug.current ?? '#'}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border text-center flex flex-col items-center justify-center"
          >
            <span className="text-5xl mb-4">📰</span>
            <h3 className="text-xl font-semibold mb-2">Lire un article gratuit</h3>
            <p className="text-sm text-gray-600">Accédez librement à un contenu du numéro.</p>
          </a>

          {/* Abonnement */}
          <a
            href="/abonnement"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border text-center flex flex-col items-center justify-center"
          >
            <span className="text-5xl mb-4">💳</span>
            <h3 className="text-xl font-semibold mb-2">S’abonner à la revue</h3>
            <p className="text-sm text-gray-600">Recevez tous les numéros à venir.</p>
          </a>

          {/* Achat à l’unité */}
          <a
            href={`/acheter/${slug}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border text-center flex flex-col items-center justify-center"
          >
            <span className="text-5xl mb-4">🛒</span>
            <h3 className="text-xl font-semibold mb-2">Acheter ce numéro</h3>
            <p className="text-sm text-gray-600">Téléchargement ou envoi postal.</p>
          </a>
        </div>
      </section>
    </main>
  )
}
