// src/app/success/page.tsx
import { Suspense } from 'react'
import SuccessClient from './SuccessClient'

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuccessClient />
    </Suspense>
  )
}