import { client } from '@/lib/sanity'

type Article = {
  _id: string
  title: string
  slug: { current: string }
  type: 'free' | 'paid'
}

export default async function ArticlesPage() {
  const articles: Article[] = await client.fetch(`
    *[_type == "post"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      type
    }
  `)

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tous les articles</h1>

      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article._id} className="border-b pb-2">
            <a
              href={`/articles/${article.slug.current}`}
              className="text-xl text-blue-600 hover:underline"
            >
              {article.title}
            </a>
            {article.type === 'paid' && (
              <span className="ml-2 px-2 py-1 text-sm bg-red-100 text-red-600 rounded">
                Payant
              </span>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
