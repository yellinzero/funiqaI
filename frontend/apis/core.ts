import type { paths } from '@/types/openapi'
import type { Client, ClientMethod, FetchResponse, InitParam, MaybeOptionalInit, Middleware } from 'openapi-fetch'
import Toast from '@/components/Toast'
import { initTranslations } from '@/plugins/i18n'
import { I18N_COOKIE_NAME } from '@/plugins/i18n/settings'
import { SESSION_COOKIE_NAME } from '@/utils/constants'
import createClient from 'openapi-fetch'
import { Cookies } from 'react-cookie'

// Types
export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

export type ExtractInitType<Method extends HttpMethod, Path extends keyof paths> =
  MaybeOptionalInit<paths[Path], Method>

export type ExtractBodyType<Method extends HttpMethod, Path extends keyof paths> =
  'body' extends keyof MaybeOptionalInit<paths[Path], Method>
    ? MaybeOptionalInit<paths[Path], Method>['body']
    : never

export type ExtractParamsType<Method extends HttpMethod, Path extends keyof paths> =
  'params' extends keyof MaybeOptionalInit<paths[Path], Method>
    ? MaybeOptionalInit<paths[Path], Method>['params']
    : never

export type PathsWithMethod<T, M extends HttpMethod> = keyof {
  [P in keyof T as T[P] extends { [K in M]: unknown } ? P : never]: T[P]
}

export type ExtractResponseType<Method extends HttpMethod, Path extends keyof paths> =
  paths[Path][Method] extends { responses: { 200: { content: { 'application/json': infer R } } } }
    ? R extends { data: infer D }
      ? D
      : never
    : never

export type CustomFetchResponse<Path extends keyof paths, Method extends HttpMethod> =
  | {
    data: ExtractResponseType<Method, Path>
    error?: never
    response: FetchResponse<paths[Path], MaybeOptionalInit<paths[Path], Method>, Path>['response']
  }
  | {
    data?: never
    error: FetchResponse<paths[Path], MaybeOptionalInit<paths[Path], Method>, Path>['error']
    response: FetchResponse<paths[Path], MaybeOptionalInit<paths[Path], Method>, Path>['response']
  }

// Constants
const namespaces = ['error']

// API Clients
export const apiFetch = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE,
  credentials: 'include',
})
export const publicApiFetch = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE,
  credentials: 'include',
})

// Error Handling
interface ResponseData {
  code: string
  message: string
  data: unknown | null
}

export class HttpError extends Error {
  code: string
  status: number
  data: ResponseData | null
  response: Response

  constructor(msg: string, response: Response, data?: ResponseData) {
    super(msg)
    this.name = 'HttpError'
    this.code = data?.code || String(response.status)
    this.status = response.status
    this.data = data || null
    this.response = response
  }
}

// Add new utility function for cookie handling
async function getCookieContext() {
  if (typeof window === 'undefined') {
    // Server-side
    const { cookies: cookiesClient } = await import('next/headers')
    try {
      const cookieStore = await cookiesClient()
      const language = cookieStore.get(I18N_COOKIE_NAME)?.value ?? 'en'
      const session = JSON.parse(cookieStore.get(SESSION_COOKIE_NAME)?.value ?? '{}')
      return { language, session }
    }
    catch (error) {
      console.error('Failed to access server-side cookies:', error)
      return { language: 'en', session: {} }
    }
  }
  else {
    // Client-side
    const cookies = new Cookies()
    const language = cookies.get(I18N_COOKIE_NAME) ?? 'en'
    const session = cookies.get(SESSION_COOKIE_NAME) ?? {}
    return { language, session }
  }
}

// Middlewares
const requestContextMiddleware: Middleware = {
  async onRequest({ request }) {
    const { language, session } = await getCookieContext()
    request.headers.set('X-LANGUAGE', language)
    request.headers.set('X-Tenant-ID', session.tenantId)
    if (session.accessToken) {
      request.headers.set('Authorization', `Bearer ${session.accessToken}`)
    }

    // FIXME: https://github.com/vercel/next.js/issues/63170
    if (typeof window === 'undefined') {
      const { cookies: cookiesClient } = await import('next/headers')
      const cookieStore = await cookiesClient()
      const cookie = cookieStore
        .getAll()
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ')
      request.headers.set('Cookie', cookie)
    }
    return request
  },
}

const responseMiddleware: Middleware = {
  async onResponse({ response }) {
    const newAccessToken = response.headers.get('X-New-Access-Token')
    if (newAccessToken) {
      if (typeof window !== 'undefined') {
        const cookies = new Cookies()
        const session = cookies.get(SESSION_COOKIE_NAME) ?? {}
        cookies.set(SESSION_COOKIE_NAME, { ...session, accessToken: newAccessToken })
      }
      else {
        // TODO: Server-side(if needed)
        // const { cookies } = await import('next/headers')
        // const cookieStore = await cookies()
        // const session = JSON.parse(cookieStore.get(SESSION_COOKIE_NAME)?.value ?? '{}')
        // cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify({ ...session, accessToken: newAccessToken }))
      }
    }

    const status = response.status
    if (status >= 400 && status < 600) {
      switch (status) {
        case 401: {
          if (typeof window !== 'undefined') {
            window.location.href = '/sign-in'
          }
          break
        }
      }
    }
    return response
  },
  async onError({ error }) {
    console.error(error)
  },
}

// Apply middlewares
apiFetch.use(requestContextMiddleware)
apiFetch.use(responseMiddleware)
publicApiFetch.use(responseMiddleware)

// API Factory
export function createFetchApi(client: Client<paths>) {
  const handleResponse = async <Path extends keyof paths, Method extends HttpMethod>(
    // eslint-disable-next-line ts/no-empty-object-type
    promise: ReturnType<ClientMethod<{}, Method, Path>>,
  ): Promise<CustomFetchResponse<Path, Method>> => {
    const { data, response, error } = await promise

    const { language } = await getCookieContext()

    const { t } = await initTranslations(language, namespaces)
    const errorCode = data?.code || error?.code
    if (errorCode && errorCode !== '0') {
      if (typeof window !== 'undefined') {
        Toast.error({ message: t(errorCode, { ns: 'error' }) || t('undefined_error', { ns: 'error' }) })
      }
      throw new HttpError(data?.message || error?.message, response, data)
    }
    else if (response.status >= 400 && response.status < 600) {
      const httpErrorMsg = t(`HCODE${response.status}`, { ns: 'error' })
      if (typeof window !== 'undefined') {
        Toast.error({ message: httpErrorMsg })
      }
      throw new HttpError(httpErrorMsg, response, data)
    }

    return {
      data: data?.data,
      error: response.error,
      response: response.response,
    }
  }

  return {
    GET: <Path extends PathsWithMethod<paths, 'get'>>(
      url: Path,
      ...init: InitParam<MaybeOptionalInit<paths[Path], 'get'>>
    ) => handleResponse<Path, 'get'>(client.GET(url, ...init)),

    POST: <Path extends PathsWithMethod<paths, 'post'>>(
      url: Path,
      ...init: InitParam<MaybeOptionalInit<paths[Path], 'post'>>
    ) => handleResponse<Path, 'post'>(client.POST(url, ...init)),

    PUT: <Path extends PathsWithMethod<paths, 'put'>>(
      url: Path,
      ...init: InitParam<MaybeOptionalInit<paths[Path], 'put'>>
    ) => handleResponse(client.PUT(url, ...init)),

    DELETE: <Path extends PathsWithMethod<paths, 'delete'>>(
      url: Path,
      ...init: InitParam<MaybeOptionalInit<paths[Path], 'delete'>>
    ) => handleResponse<Path, 'delete'>(client.DELETE(url, ...init)),

    OPTIONS: <Path extends PathsWithMethod<paths, 'options'>>(
      url: Path,
      ...init: InitParam<MaybeOptionalInit<paths[Path], 'options'>>
    ) => handleResponse<Path, 'options'>(client.OPTIONS(url, ...init)),

    HEAD: <Path extends PathsWithMethod<paths, 'head'>>(
      url: Path,
      ...init: InitParam<MaybeOptionalInit<paths[Path], 'head'>>
    ) => handleResponse<Path, 'head'>(client.HEAD(url, ...init)),

    PATCH: <Path extends PathsWithMethod<paths, 'patch'>>(
      url: Path,
      ...init: InitParam<MaybeOptionalInit<paths[Path], 'patch'>>
    ) => handleResponse<Path, 'patch'>(client.PATCH(url, ...init)),

    TRACE: <Path extends PathsWithMethod<paths, 'trace'>>(
      url: Path,
      ...init: InitParam<MaybeOptionalInit<paths[Path], 'trace'>>
    ) => handleResponse<Path, 'trace'>(client.TRACE(url, ...init)),
  }
}

// Export API instances
export const fetchApi = createFetchApi(apiFetch)
export const fetchPublicApi = createFetchApi(publicApiFetch)
