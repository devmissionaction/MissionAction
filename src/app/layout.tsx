import { type Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="flex justify-between items-center p-4 h-16">
           <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Mission Action" width={48} height={48} />
            </Link>
          </div>
            <nav className="hidden md:flex gap-8 text-md font-bold justify-center flex-1">
              <Link href="/" className='navbar-text'>Accueil</Link>
              <Link href="/about" className='navbar-text'>Qui sommes nous ?</Link>
              <Link href="/numeros" className='navbar-text'>Numéros</Link>
              <Link href="/contact" className='navbar-text'>Contact</Link>
            </nav>
          </header>

          <main>{children}</main>
        </body>
      </html>
  )
}
