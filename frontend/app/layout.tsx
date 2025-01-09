import type { ThemeProviderProps } from '@mui/material/styles/ThemeProvider'
import { initTranslations } from '@/plugins/i18n'
import { getLocaleFromServer } from '@/plugins/i18n/server'
import { roboto } from '@/theme'

import { themeCookieName } from '@/theme/configs'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { cookies } from 'next/headers'
import React from 'react'
import Providers from '../components/Providers'
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
          <Providers locale={locale} defaultMode={themeCookie}>
            {children}
          </Providers>
        </body>
      </html>
    </React.StrictMode>

  )
}
