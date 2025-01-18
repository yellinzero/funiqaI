'use client'
import type { Locale } from '@/plugins/i18n/settings'
import I18nProvider from '@/components/I18nProvider'
import { theme } from '@/theme'
import { themeCookieName } from '@/theme/configs'
import { getQueryClient } from '@/utils/get-query-client'
import { CssBaseline } from '@mui/material'

import { ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { CookiesProvider, useCookies } from 'react-cookie'

interface ProvidersProps {
  children: React.ReactNode
  locale: Locale
}

export default function Providers({ children, locale }: ProvidersProps) {
  const [cookies, setCookie] = useCookies()
  let themeCookie = cookies[themeCookieName]
  if (!themeCookie) {
    themeCookie = 'system'
    setCookie(themeCookieName, themeCookie)
  }
  const queryClient = getQueryClient()
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <CookiesProvider>
        <ThemeProvider theme={theme} defaultMode={themeCookie}>
          <CssBaseline enableColorScheme />
          <SnackbarProvider maxSnack={3}>
            <QueryClientProvider client={queryClient}>
              <I18nProvider locale={locale}>
                {children}
              </I18nProvider>
            </QueryClientProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </CookiesProvider>
    </AppRouterCacheProvider>
  )
}
