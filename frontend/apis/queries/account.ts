import { getAccountTenantsApi } from '@/apis/openapis/account'
import { queryOptions } from '@tanstack/react-query'

export const tenantsQueryKey = ['tenants'] as const
export const tenantsOptions = queryOptions({
  queryKey: tenantsQueryKey,
  queryFn: async () => {
    return getAccountTenantsApi()
  },
})
