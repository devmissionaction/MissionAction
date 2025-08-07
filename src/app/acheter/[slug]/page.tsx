import AcheterNumeroClient from './AcheterNumeroClient'

type Props = {
  params: { slug: string }
}

export default function AcheterNumeroPage({ params }: any) {
  return <AcheterNumeroClient slug={params.slug} />
}
