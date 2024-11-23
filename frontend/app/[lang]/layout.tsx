import type { ThemeProviderProps } from '@mui/material/styles/ThemeProvider'
import type { Metadata } from 'next'
import { languages } from '@/plugins/i18n/settings'
import theme from '@/theme'
import { themeCookieName } from '@/theme/configs'
import { CssBaseline } from '@mui/material'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'

import { dir } from 'i18next'
import { Roboto } from 'next/font/google'
import { cookies } from 'next/headers'
import React from 'react'
import '@/assets/css/globals.css'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export async function generateStaticParams() {
  return languages.map(lang => ({ lang }))
}

export const metadata: Metadata = {
  title: 'Funiq AI',
  description: 'AI with fun',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: {
    lang: string
  }
}>) {
  const { lang } = await params
  const cookieStore = await cookies()
  let themeCookie = cookieStore.get(themeCookieName)?.value as ThemeProviderProps['defaultMode']
  if (!themeCookie) {
    themeCookie = 'system'
    cookieStore.set(themeCookieName, themeCookie)
  }
  return (
    <React.StrictMode>
      <html lang={lang} dir={dir(lang)} className={roboto.variable} suppressHydrationWarning>
        <body>
          <InitColorSchemeScript attribute="data-mui-color-scheme" />
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme} defaultMode={themeCookie}>
              <CssBaseline enableColorScheme />

              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </React.StrictMode>

  )
}
