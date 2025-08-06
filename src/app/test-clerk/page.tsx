import { auth } from '@clerk/nextjs/server'

export default async function TestClerkPage() {
  const { userId } = await auth() 

  return (
    <div className="p-6">
      {userId ? `Connecté en tant que : ${userId}` : 'Non connecté'}
    </div>
  )
}
