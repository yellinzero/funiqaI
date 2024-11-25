import type { KeyPrefix, Namespace } from 'i18next'
import type { Locale } from './settings'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { cookies } from 'next/headers'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { fallbackLang, getOptions, i18nCookieName, languages } from './settings'

async function initI18next(lang: string, ns: string) {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`@/locales/${language}/${namespace}.json`)))
    .init(getOptions(lang, ns))
  return i18nInstance
}

export async function translationOnServer(ns: string, lng?: string, options: { keyPrefix?: KeyPrefix<Namespace> } = {}) {
  const lang = lng || await getLangOnServer()
  const i18nextInstance = await initI18next(lang, ns)
  return {
    t: i18nextInstance.getFixedT(lang, ns, options.keyPrefix),
    i18n: i18nextInstance,
  }
}

export async function getLangOnServer(): Promise<Locale> {
  let langCookie = (await cookies()).get(i18nCookieName)?.value || fallbackLang
  if (!languages.includes(langCookie as Locale)) {
    langCookie = fallbackLang
  }

  return langCookie
}
