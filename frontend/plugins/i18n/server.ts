import type { Locale } from './settings'
import { cookies } from 'next/headers'
import { fallbackLang, I18N_COOKIE_NAME, languages } from './settings'

export async function getLocaleFromServer(): Promise<Locale> {
  let langCookie = (await cookies()).get(I18N_COOKIE_NAME)?.value || fallbackLang
  if (!languages.includes(langCookie as Locale)) {
    langCookie = fallbackLang
  }

  return langCookie
}
