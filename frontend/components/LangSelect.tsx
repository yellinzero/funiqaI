import type { SelectProps } from '@mui/material/Select'
import { i18nCookieName, languagesOptions } from '@/plugins/i18n/settings'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'

export default function LangSelect(props: SelectProps) {
  const router = useRouter()
  const [_cookie, setCookie] = useCookies()
  const { i18n } = useTranslation()
  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang)
    setCookie(i18nCookieName, lang, { path: '/' })
    router.refresh()
  }
  return (
    <Select
      value={i18n.language}
      onChange={event =>
        changeLanguage(event.target.value as string)}
      SelectDisplayProps={{
        'data-screenshot': 'toggle-mode',
      } as React.HTMLAttributes<HTMLDivElement>}
      {...props}
    >
      {languagesOptions.map(option => <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>)}
    </Select>
  )
}
