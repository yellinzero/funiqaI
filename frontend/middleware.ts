import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 1. Specify protected and public routes
const publicRoutes = [
  '/',
  '/forgot-password',
  '/sign-in',
  '/sign-up',
  '/create-tenant',
  '/activate',
]

export default async function middleware(req: NextRequest, res: NextResponse) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)

  const session = (await cookies()).get('session')?.value

  // 4. Redirect to /sign-in if the user is not authenticated
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
