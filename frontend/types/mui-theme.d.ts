// mui-theme.d.ts
import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    vars: Record<string, any>
  }
  interface ThemeOptions {
    vars?: Record<string, any>
  }
}
