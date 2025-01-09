'use client'
import type { ThemeProviderProps } from '@mui/material/styles/ThemeProvider'
import I18nProvider from '@/components/I18nProvider'
import { theme } from '@/theme'
import { getQueryClient } from '@/utils/get-query-client'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'

import { QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  defaultMode: ThemeProviderProps['defaultMode']
}

export default function Providers({ children, locale, defaultMode }: ProvidersProps) {
  const queryClient = getQueryClient()
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme} defaultMode={defaultMode}>
        <CssBaseline enableColorScheme />
        <QueryClientProvider client={queryClient}>
          <I18nProvider locale={locale}>
            <SnackbarProvider maxSnack={3}>
              {children}
            </SnackbarProvider>
          </I18nProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
