import { client } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

interface Params {
  params: {
    slug: string
  }
}

type Post = {
  title: string
  body: PortableTextBlock[]
  type: 'free' | 'paid'
  mainImage?: {
    asset: { url: string }
    alt?: string
  }
}

export default async function ArticlePage({ params }: Params) {
  const slug = params.slug

  const post: Post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      type,
      mainImage {
        asset -> {
          url
        },
        alt
      }
    }`,
    { slug }
  )

  if (!post) return <div>Article introuvable.</div>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.mainImage?.asset?.url && (
        <img
          src={post.mainImage.asset.url}
          alt={post.mainImage.alt || ''}
          className="mb-6 rounded"
        />
      )}
      <article className="prose">
        <PortableText value={post.body} />
      </article>
    </main>
  )
}
