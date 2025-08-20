'use client'

import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

type AboutPageData = {
  heroImage?: {
    asset: { url: string }
    alt?: string
  }
  content?: PortableTextBlock[]
}

type TeamMember = {
  _id: string
  name: string
  role: string
  photo?: {
    asset: {
      url: string
    }
  }
  bio: PortableTextBlock[]
}

export default function AboutPageClient({
  data,
  teamMembers,
}: {
  data: AboutPageData
  teamMembers: TeamMember[]
}) {
  return (
    <main>
      {/* HERO FULL SCREEN */}
      {data.heroImage?.asset?.url && (
        <section className="w-full h-screen relative">
          <img
            src={data.heroImage.asset.url}
            alt={data.heroImage.alt || 'Image qui sommes-nous'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold text-center text-title">Qui sommes-nous ?</h1>
          </div>
        </section>
      )}

      {/* CONTENU TEXTE */}
      <section className="py-40 px-6 max-w-4xl mx-auto prose prose-lg">
        {data.content && <PortableText value={data.content} />}
      </section>

      {/* ÉQUIPE */}
      <section className="min-h-screen px-6 py-16 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12 ">Notre équipe</h2>
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          {teamMembers.map((member, index) => (
            <div
              key={member._id}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <img
                src={member.photo?.asset?.url}
                alt={member.name}
                className="w-48 h-48 object-cover rounded-full border-4 border-red-700 shadow-lg"
              />
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-red-700 font-semibold mb-2">{member.role}</p>
                <div className="prose prose-sm">
                  <PortableText value={member.bio} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
