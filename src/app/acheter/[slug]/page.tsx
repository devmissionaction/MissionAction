import { type Metadata } from 'next'
import AcheterNumeroClient from './AcheterNumeroClient'

type Props = {
  params: { slug: string }
}

export default async function AcheterNumeroPage({ params }: Props) {
  return <AcheterNumeroClient slug={params.slug} />
}
