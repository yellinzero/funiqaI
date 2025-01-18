import { initTranslations } from '@/plugins/i18n'
import { getLocaleFromServer } from '@/plugins/i18n/server'
import { roboto } from '@/theme'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
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
          <Providers locale={locale}>
            {children}
          </Providers>
        </body>
      </html>
    </React.StrictMode>

  )
}
