import { SESSION_COOKIE_NAME } from '@/utils/constants'
import { useCookies } from 'react-cookie'

export function useSessionCookie() {
  const [cookies, setCookies, removeCookie] = useCookies()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  function setAuth(accessToken: string, refreshToken: string, tenantId?: string) {
    setCookies(SESSION_COOKIE_NAME, {
      accessToken,
      refreshToken,
      tenantId,
    }, {
      secure: true,
      sameSite: 'strict',
      expires: expiresAt,
      path: '/',
    })
  }

  function getAuth() {
    const session = cookies[SESSION_COOKIE_NAME]
    return {
      accessToken: session?.accessToken,
      refreshToken: session?.refreshToken,
      tenantId: session?.tenantId,
    }
  }

  function clearAuth() {
    removeCookie(SESSION_COOKIE_NAME)
  }

  return {
    setAuth,
    getAuth,
    clearAuth,
  }
}
