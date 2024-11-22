import type { SelectProps } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useColorScheme } from '@mui/material/styles'
import * as React from 'react'

export default function ColorModeSelect(props: SelectProps) {
  const { mode, setMode } = useColorScheme()
  if (!mode) {
    return null
  }
  return (
    <Select
      value={mode}
      onChange={event =>
        setMode(event.target.value as 'system' | 'light' | 'dark')}
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
