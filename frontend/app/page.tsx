import Header from '@/components/Header'
import MobileNavbar from '@/components/MobileNavbar'
import SideMenu from '@/components/SideMenu'
import { translationOnServer } from '@/plugins/i18n/server'
import { getThemeVarsOnServer } from '@/theme/server'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { alpha } from '@mui/material/styles'
import React from 'react'

export default async function Home() {
  const { t } = await translationOnServer('global')
  const themeVars = await getThemeVarsOnServer()
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <SideMenu />
      <MobileNavbar />
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: alpha(themeVars.palette.background.default, 1),
          overflow: 'auto',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },

          }}
        >
          <Header />
          <div>Hello world </div>
          <div>{t('welcome')}</div>
        </Stack>
      </Box>
    </Box>
  )
}
