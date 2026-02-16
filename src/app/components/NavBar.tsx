'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

const SCROLL_THRESHOLD = 80

const navLinks = [
  { href: '/about', label: 'Qui sommes nous ?' },
  { href: '/festival', label: 'Le Festival' },
  { href: '/numeros', label: 'Numéros' },
  { href: '/videos', label: 'Programme vidéo' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isTransparent, setIsTransparent] = useState(true)

  // Vérification si la page actuelle doit être opaque par défaut
  const isOpaquePage = 
    pathname === '/inscription' || 
    pathname.startsWith('/articles') || 
    pathname.startsWith('/numeros/') // Ceci attrape tous les slugs dynamiques après /numeros/

  // La navbar est transparente seulement si on n'est pas sur une "page opaque" ET que le scroll est en haut
  const effectiveTransparent = isOpaquePage ? false : isTransparent

  useEffect(() => {
    // Si on est sur une page opaque, pas besoin d'écouter le scroll
    if (isOpaquePage) return

    const updateTransparent = () => {
      setIsTransparent(window.scrollY <= SCROLL_THRESHOLD)
    }

    updateTransparent()
    window.addEventListener('scroll', updateTransparent, { passive: true })
    return () => window.removeEventListener('scroll', updateTransparent)
  }, [pathname, isOpaquePage])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 w-full z-50 flex justify-between items-center p-10 h-16 transition-all duration-300',
        effectiveTransparent
          ? 'bg-transparent text-white'
          : 'bg-white text-black shadow-sm'
      )}
    >
      <div className="flex items-center flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={effectiveTransparent ? '/logo_blanc.svg' : '/logo.svg'}
            alt="Mission Action"
            width={150}
            height={150}
            className="transition-opacity duration-300"
          />
        </Link>
      </div>

      <nav className="hidden md:flex gap-8 text-md font-bold justify-center flex-1 uppercase">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'navbar-text transition-all duration-300',
                isActive && 'font-avega border-b-2 pb-0.5',
                effectiveTransparent ? 'border-white' : 'border-black'
              )}
              style={isActive ? { fontFamily: "'Avega Italic', sans-serif" } : undefined}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}