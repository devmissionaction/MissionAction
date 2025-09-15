import { type Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { FaInstagram } from 'react-icons/fa'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mission Action',
  description: 'Revue associative engagée',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        {/* HEADER */}
        <header className="flex justify-between items-center p-10 h-16">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Mission Action" width={150} height={150} />
            </Link>
          </div>
          <nav className="hidden md:flex gap-8 text-md font-bold justify-center flex-1">
            <Link href="/" className="navbar-text">Accueil</Link>
            <Link href="/about" className="navbar-text">Qui sommes nous ?</Link>
            <Link href="/numeros" className="navbar-text">Numéros</Link>
            <Link href= "/videos">Programme vidéo </Link>
            <Link href="/contact" className="navbar-text">Contact</Link>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-grow">{children}</main>

        {/* FOOTER */}
        <footer className="bg-gray-100 text-sm text-gray-600 py-6 px-4 mt-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Mission Action. Tous droits réservés.</p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/missionactionenserie"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <FaInstagram size={16} />
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
