import { client } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { FiFileText, FiBox } from 'react-icons/fi'
import BuyButton from '@/app/components/BuyButton'

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
  params: Promise<{
    slug: string
  }>
}

export default async function NumeroPage({ params }: Params) {
  const { slug } = await params

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
        <h2 className="text-4xl font-bold mb-16 tracking-tight">Accès au contenu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
          
          {/* Article gratuit */}
          <a
            href={`/articles/${issue.articles?.find((a) => a.type === 'free')?.slug.current ?? '#'}`}
            className="group bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-1 text-center flex flex-col items-center"
          >
            <FiFileText className="text-4xl text-gray-800 stroke-red-700 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold mb-2">Lire un article gratuit</h3>
            <p className="text-gray-500 text-sm">Un aperçu libre du numéro en cours.</p>
          </a>
          
          {/* ✅ Achat à l’unité (client component) */}
          <BuyButton slug={slug} />

          {/* Abonnement */}
          <a
            href="/abonnement"
            className="group bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-1 text-center flex flex-col items-center"
          >
            <FiBox className="text-4xl text-gray-800 stroke-red-700 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold mb-2">S’abonner à la revue</h3>
            <p className="text-gray-500 text-sm">Recevez tous les futurs numéros chez vous.</p>
          </a>
        </div>
      </section>
    </main>
  )
}
