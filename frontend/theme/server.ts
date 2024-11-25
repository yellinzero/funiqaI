import type { PaletteMode } from '@mui/material'
import { cookies } from 'next/headers'
import { themeCookieName } from './configs'
import { getDesignTokens } from './themePrimitives'

export async function getThemeVarsOnServer() {
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get(themeCookieName)?.value as PaletteMode
  return getDesignTokens(themeCookie)
}
