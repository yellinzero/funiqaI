'use client'

import LangSelect from '@/components/LangSelect'
import { LogoWithName } from '@/components/SiteLogo'
import ColorModeIconDropdown from '@/theme/ColorModeIconDropdown'
import { Stack } from '@mui/material'
import Box from '@mui/material/Box'

export default function AuthHeader() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'fixed',
      width: '100%',
      top: '0',
      padding: '12px',
    }}
    >
      <LogoWithName />
      <Stack direction="row" sx={{ gap: 1 }}>
        <LangSelect />
        <ColorModeIconDropdown />
      </Stack>
    </Box>
  )
}
