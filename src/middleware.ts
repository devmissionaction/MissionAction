import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Ignore Next.js internals et fichiers statiques
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Toujours exécuter sur les routes API
    '/(api|trpc)(.*)',
    
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
