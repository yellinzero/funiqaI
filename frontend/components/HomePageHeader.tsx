'use client'
import Stack from '@mui/material/Stack'
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown'
import LangSelect from './LangSelect'

export default function HomePageHeader() {
  return (
    <Stack
      direction="row"
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'right',
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
