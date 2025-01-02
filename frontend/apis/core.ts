import type { paths } from '@/types/openapi'
import type { MaybeOptionalInit } from 'openapi-fetch'
import createClient from 'openapi-fetch'

export const apiFetch = createClient<paths>({ baseUrl: `/api` })
export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'
export type ExtractInitType<
  Method extends HttpMethod,
  Path extends keyof paths,
> = MaybeOptionalInit<paths[Path], Method>

export type ExtractBodyType<
  Method extends HttpMethod,
  Path extends keyof paths,
> = 'body' extends keyof MaybeOptionalInit<paths[Path], Method>
  ? MaybeOptionalInit<paths[Path], Method>['body']
  : never

export type ExtractParamsType<
  Method extends HttpMethod,
  Path extends keyof paths,
> = 'params' extends keyof MaybeOptionalInit<paths[Path], Method>
  ? MaybeOptionalInit<paths[Path], Method>['params']
  : never
