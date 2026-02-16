import Link from 'next/link'
import { TallyForm } from '@/app/components/TallyForm'

const TALLY_FORM_ID = 'J9A5PX'

export default function InscriptionPage() {
  return (
    <>      
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          <h1 className="font-avega text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-4 uppercase">
            Inscription Festival
          </h1>
          <p className="text-center text-gray-600 mb-10">
            Remplissez le formulaire ci-dessous pour vous inscrire.
          </p>

          <div className="w-full">
            <TallyForm formId={TALLY_FORM_ID} />
          </div>
        </div>
      </div>
    </>
  )
}