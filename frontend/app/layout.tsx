import type { ThemeProviderProps } from '@mui/material/styles/ThemeProvider'
import I18nProvider from '@/components/I18nProvider'
import { initTranslations } from '@/plugins/i18n'
import { getLocaleFromServer } from '@/plugins/i18n/server'
import { roboto, theme } from '@/theme'
import { themeCookieName } from '@/theme/configs'

import { CssBaseline } from '@mui/material'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { cookies } from 'next/headers'
import React from 'react'
import '@/assets/css/globals.css'

const namespaces = ['global']
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocaleFromServer()
  await initTranslations(locale, namespaces)
  const cookieStore = await cookies()
  let themeCookie = cookieStore.get(themeCookieName)?.value as ThemeProviderProps['defaultMode']
  if (!themeCookie) {
    themeCookie = 'system'
    cookieStore.set(themeCookieName, themeCookie)
  }
  return (
    <React.StrictMode>
      <html lang={locale} className={roboto.variable} suppressHydrationWarning>
        <body style={
          {
            width: '100vw',
            height: '100vh',
          }
        }
        >
          <InitColorSchemeScript attribute="data-funiq-ai-color-scheme" />
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme} defaultMode={themeCookie}>
              <CssBaseline enableColorScheme />
              <I18nProvider locale={locale}>
                {children}
              </I18nProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </React.StrictMode>

  )
}
