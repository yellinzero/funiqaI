export const fallbackLang = 'en'
export const languages = [fallbackLang, 'zh-CN']
export const i18nCookieName = 'i18next'
export const defaultNS = 'global'

export function getOptions(lang = fallbackLang, ns = defaultNS) {
  return {
    // debug: true,
    supportedLangs: languages,
    fallbackLang,
    lng: lang,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}

export type Locale = typeof languages[number]

export const languagesOptions = [{
  value: 'en',
  label: 'English',
}, {
  value: 'zh-CN',
  label: '简体中文',
}]
