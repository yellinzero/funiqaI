import type { NextRequest } from 'next/server'
import { cookieName, fallbackLang, languages } from '@/plugins/i18n/settings'
import acceptLanguage from 'accept-language'
import { NextResponse } from 'next/server'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lang*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)'],
}

export function middleware(req: NextRequest) {
  let lang
  if (req.cookies.has(cookieName))
    lang = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lang)
    lang = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lang)
    lang = fallbackLang

  // Redirect if lang in path is not supported
  if (
    !languages.some((loc: string) => req.nextUrl.pathname.startsWith(`/${loc}`))
    && !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}`, req.url))
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') as string | URL)
    const langInReferer = languages.find(l => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (langInReferer)
      response.cookies.set(cookieName, langInReferer)
    return response
  }

  return NextResponse.next()
}
