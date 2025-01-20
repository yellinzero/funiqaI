import { getAccountInfoApi, getAccountTenantsApi } from '@/apis/openapis/account'
import { queryOptions } from '@tanstack/react-query'

export const tenantsQueryKey = ['tenants'] as const
export const tenantsOptions = queryOptions({
  queryKey: tenantsQueryKey,
  queryFn: getAccountTenantsApi,
})

export const meQueryKey = ['me'] as const
export const meOptions = queryOptions({
  queryKey: meQueryKey,
  queryFn: getAccountInfoApi,
})
