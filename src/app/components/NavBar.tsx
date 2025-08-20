'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 transition-all duration-300',
        isScrolled ? 'bg-white text-black shadow' : 'bg-transparent text-white'
      )}
    >
      <div className="flex items-center flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Mission Action" width={48} height={48} />
        </Link>
      </div>

      <nav className="hidden md:flex gap-8 text-sm font-medium justify-center flex-1">
        <Link href="/">Accueil</Link>
        <Link href="/about">Qui sommes nous ?</Link>
        <Link href="/numeros">Numéros</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  )
}
