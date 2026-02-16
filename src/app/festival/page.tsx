import { Suspense } from 'react'
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
  partenaires?: FestivalPartner[]
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
    inscriptionLabel,
    partenaires[]->{
      _id,
      name,
      logo { asset -> { url } },
      url,
      order
    }
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

  // Partenaires : priorité au champ partenaires de la page, sinon documents festivalPartner
  const partenairesFromPage = data?.partenaires?.filter(Boolean) ?? []
  const partnersList =
    partenairesFromPage.length > 0
      ? [...partenairesFromPage].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        )
      : partners

  return (
    <Suspense fallback={null}>
      <FestivalPageClient
        data={data}
        partners={partnersList}
      />
    </Suspense>
  )
}
