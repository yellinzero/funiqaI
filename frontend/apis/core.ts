import type { paths } from '@/types/openapi'
import type { Client, ClientMethod, FetchResponse, InitParam, MaybeOptionalInit, Middleware } from 'openapi-fetch'
import Toast from '@/components/Toast'
import { initTranslations } from '@/plugins/i18n'
import { i18nCookieName } from '@/plugins/i18n/settings'
import Cookies from 'js-cookie'
import createClient from 'openapi-fetch'

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
export const apiFetch = createClient<paths>({ baseUrl: `/api` })
export const publicApiFetch = createClient<paths>({ baseUrl: `/api` })

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

// Middlewares
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = Cookies.get('session')
    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return request
  },
}

const responseMiddleware: Middleware = {
  async onResponse({ response }) {
    const status = response.status
    if (status >= 400 && status < 600) {
      switch (status) {
        case 401: {
          Cookies.remove('session')
          if (typeof window !== 'undefined')
            window.location.href = '/sign-in'
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
apiFetch.use(authMiddleware)
apiFetch.use(responseMiddleware)
publicApiFetch.use(responseMiddleware)

// API Factory
export function createFetchApi(client: Client<paths>) {
  const handleResponse = async <Path extends keyof paths, Method extends HttpMethod>(
    // eslint-disable-next-line ts/no-empty-object-type
    promise: ReturnType<ClientMethod<{}, Method, Path>>,
  ): Promise<CustomFetchResponse<Path, Method>> => {
    const { data, response, error } = await promise

    const locale = Cookies.get(i18nCookieName)
    const { t } = await initTranslations(locale || 'en', namespaces)
    const errorCode = data?.code || error?.code
    if (errorCode && errorCode !== '0') {
      if (typeof window !== 'undefined')
        Toast.error({ message: t(errorCode) || t('undefined_error') })
      throw new HttpError(data?.message || error?.message, response, data)
    }
    else if (response.status >= 400 && response.status < 600) {
      const httpErrorMsg = t(`HCODE${response.status}`)
      if (typeof window !== 'undefined')
        Toast.error({ message: httpErrorMsg })
      throw new HttpError(httpErrorMsg, response, data)
    }

    return {
      data: data.data,
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
