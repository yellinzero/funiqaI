import { useCookies } from 'react-cookie'

export function useSession() {
  const [cookies, setCookies] = useCookies()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  function setSession(token: string) {
    setCookies('session', token, {
      secure: true,
      expires: expiresAt,
      path: '/',
    })
  }

  function getSession() {
    return cookies.session
  }

  return {
    setSession,
    getSession,
  }
}
