import AcheterNumeroClient from './AcheterNumeroClient'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function AcheterNumeroPage({ params }: Props) {
  const { slug } = await params
  return <AcheterNumeroClient slug={slug} />
}

