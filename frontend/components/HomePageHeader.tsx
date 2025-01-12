'use client'
import Stack from '@mui/material/Stack'
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown'
import LangSelect from './LangSelect'

export default function HomePageHeader() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'right',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <Stack direction="row" sx={{ gap: 1 }}>
        <LangSelect />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  )
}
