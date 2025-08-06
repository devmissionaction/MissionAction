import AcheterNumeroClient from './AcheterNumeroClient'

type Props = {
  params: {
    slug: string
  }
}

export default function AcheterNumeroPage({ params }: Props) {
    const { slug } = params
    return <AcheterNumeroClient slug={params.slug} />
}
