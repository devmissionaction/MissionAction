import { type Metadata } from 'next'
import AcheterNumeroClient from './AcheterNumeroClient'

// params vient directement de Next.js
export default function AcheterNumeroPage({ params }: { params: { slug: string } }) {
  return <AcheterNumeroClient slug={params.slug} />
}
