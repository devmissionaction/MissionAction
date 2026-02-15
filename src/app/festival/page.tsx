import { client } from '@/lib/sanity'
import FestivalPageClient from './FestivalPageClient'
import type { PortableTextBlock } from '@portabletext/types'

type FestivalPageData = {
  heroImage?: {
    asset: { url: string }
    alt?: string
  }
  introduction?: PortableTextBlock[]
  poster?: {
    asset: { url: string }
    alt?: string
  }
  programme?: PortableTextBlock[]
  inscriptionUrl?: string
  inscriptionLabel?: string
}

type FestivalPartner = {
  _id: string
  name: string
  logo?: {
    asset: { url: string }
  }
  url?: string
  order?: number
}

export default async function FestivalPage() {
  const data: FestivalPageData = await client.fetch(`*[_type == "festivalPage"][0]{
    heroImage {
      asset -> { url },
      alt
    },
    introduction,
    poster {
      asset -> { url },
      alt
    },
    programme,
    inscriptionUrl,
    inscriptionLabel
  }`)

  const partners: FestivalPartner[] = await client.fetch(
    `*[_type == "festivalPartner"] | order(order asc, _createdAt asc){
      _id,
      name,
      logo { asset -> { url } },
      url,
      order
    }`
  )

  return (
    <FestivalPageClient
      data={data}
      partners={partners}
    />
  )
}
