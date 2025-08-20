import { client } from '@/lib/sanity'
import { FiMail, FiInstagram } from 'react-icons/fi'

type ContactPageData = {
  heroImage: {
    asset: {
      url: string
    }
    alt?: string
  }
}

export default async function ContactPage() {
  const data: ContactPageData = await client.fetch(`
    *[_type == "contactPage"][0]{
      heroImage {
        asset -> {
          url
        },
        alt
      }
    }
  `)

  return (
    <main>
      {data?.heroImage?.asset?.url && (
        <section className="w-full h-screen relative">
          <img
            src={data.heroImage.asset.url}
            alt={data.heroImage.alt || 'Image contact'}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-5xl sm:text-6xl font-bold text-center text-title">
              Contact
            </h1>
          </div>
        </section>
      )}

      <section className="bg-[#fdfcf9] text-[#222] py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Prendre contact</h2>

          <p className="mb-8 text-lg text-center">
            Une question, une proposition d’article ou envie de rejoindre l’association ?
            <br />Écrivez-nous, on vous répond sous 48h.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center mt-8">
            <li className="flex flex-col items-center text-center gap-2">
              <FiMail className="text-3xl text-gray-800" />
              <span className="font-semibold">Email</span>
              <a
                href="mailto:missionaction@gmail.com"
                className="text-gray-700 underline hover:text-black transition"
              >
                missionaction@gmail.com
              </a>
            </li>

            <li className="flex flex-col items-center text-center gap-2">
              <FiInstagram className="text-3xl text-gray-800" />
              <span className="font-semibold">Instagram</span>
              <a
                href="https://instagram.com/missionactionenserie"
                className="text-gray-700 underline hover:text-black transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                @missionactionenserie
              </a>
            </li>
          </ul>
        </div>
      </section>

    </main>
  )
}
