/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import type { KeyPrefix, Namespace } from 'i18next'
import type { UseTranslationOptions } from 'react-i18next'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import { fallbackLang, getOptions, i18nCookieName, languages } from './settings'

const runsOnServerSide = typeof window === 'undefined'

//
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`@/locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : [],
  })

export function useTranslation(ns: Namespace, lng?: string, options?: UseTranslationOptions<KeyPrefix<Namespace>>) {
  const [cookies, setCookie] = useCookies([i18nCookieName])
  const lang = lng || getLangOnClient()
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  if (runsOnServerSide && lang && i18n.resolvedLanguage !== lang) {
    i18n.changeLanguage(lang)
  }
  else {
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage)
        return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    useEffect(() => {
      if (!lang || i18n.resolvedLanguage === lang)
        return
      i18n.changeLanguage(lang)
    }, [lang, i18n])
    useEffect(() => {
      if (cookies[i18nCookieName] === lang)
        return
      setCookie(i18nCookieName, lang, { path: '/' })
    }, [lang, cookies, setCookie])
  }
  return ret
}

export function useChangeLanguage() {
  const router = useRouter()
  const [_cookie, setCookie] = useCookies([i18nCookieName])

  return (lng: string) => {
    const lang = languages.includes(lng) ? lng : fallbackLang

    // Change language in i18next
    i18next.changeLanguage(lang)

    // Set the cookie for language preference
    setCookie(i18nCookieName, lang, { path: '/' })

    // Refresh the router to update the language-dependent content
    router.refresh()
  }
}
export function getLangOnClient(): string {
  return Cookies.get(i18nCookieName) || fallbackLang
}
