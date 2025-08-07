import { client } from '@/lib/sanity'
import AboutPageClient from './AboutPageClient'
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

export default async function AboutPage() {
  const data: AboutPageData = await client.fetch(`*[_type == "aboutPage"][0]{
    heroImage {
      asset -> { url },
      alt
    },
    content
  }`)

  const teamMembers: TeamMember[] = await client.fetch(`*[_type == "teamMember"] | order(_createdAt asc){
    _id,
    name,
    role,
    photo {
      asset -> { url }
    },
    bio
  }`)

  return <AboutPageClient data={data} teamMembers={teamMembers} />
}
