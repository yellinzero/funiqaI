import Header from '@/components/Header'
import MobileNavbar from '@/components/MobileNavbar'
import SideMenu from '@/components/SideMenu'
import { initTranslations } from '@/plugins/i18n'
import { getLocaleFromServer } from '@/plugins/i18n/server'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import React from 'react'

const namespaces = ['global']
export default async function Home() {
  const locale = await getLocaleFromServer()
  const { i18n: { t } } = await initTranslations(locale, namespaces)
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <SideMenu />
      <MobileNavbar />
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
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
