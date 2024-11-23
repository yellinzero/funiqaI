import type { SelectProps } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useColorScheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useCookies } from 'react-cookie'
import { themeCookieName } from './configs'

export default function ColorModeSelect(props: SelectProps) {
  const router = useRouter()
  const { mode, setMode } = useColorScheme()
  const [_cookies, setCookie] = useCookies([themeCookieName])
  if (!mode) {
    return null
  }

  function handleMode(targetMode: 'system' | 'light' | 'dark') {
    setCookie(themeCookieName, targetMode)
    router.refresh()
    setMode(targetMode)
  }
  return (
    <Select
      value={mode}
      onChange={event =>
        handleMode(event.target.value as 'system' | 'light' | 'dark')}
      SelectDisplayProps={{
        'data-screenshot': 'toggle-mode',
      } as React.HTMLAttributes<HTMLDivElement>}
      {...props}
    >
      <MenuItem value="system">System</MenuItem>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </Select>
  )
}
