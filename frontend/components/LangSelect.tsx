import type { SelectProps } from '@mui/material/Select'
import { getLangOnClient, useChangeLanguage } from '@/plugins/i18n/client'
import { languagesOptions } from '@/plugins/i18n/settings'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import * as React from 'react'

export default function LangSelect(props: SelectProps) {
  const changeLanguage = useChangeLanguage()
  const langCookie = getLangOnClient()
  return (
    <Select
      value={langCookie}
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
