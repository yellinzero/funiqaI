import type { Locale } from './settings'
import { cookies } from 'next/headers'
import { fallbackLang, i18nCookieName, languages } from './settings'

export async function getLocaleFromServer(): Promise<Locale> {
  let langCookie = (await cookies()).get(i18nCookieName)?.value || fallbackLang
  if (!languages.includes(langCookie as Locale)) {
    langCookie = fallbackLang
  }

  return langCookie
}
