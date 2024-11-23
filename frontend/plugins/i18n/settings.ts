export const fallbackLang = 'en'
export const languages = [fallbackLang, 'zh-CN']
export const cookieName = 'i18next'
export const defaultNS = 'translation'

export function getOptions(lang = fallbackLang, ns = defaultNS) {
  return {
    // debug: true,
    supportedLangs: languages,
    fallbackLang,
    lang,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}

export type Locale = typeof languages[number]
