import { type ExtractBodyType, fetchApi } from '@/apis/core'

const getAccountInfoUrl = '/account/me' as const
export async function getAccountInfoApi() {
  return await fetchApi.GET(getAccountInfoUrl)
}

const getAccountTenantsUrl = '/account/tenants' as const
export async function getAccountTenantsApi() {
  return await fetchApi.GET(getAccountTenantsUrl)
}

const createTenantUrl = '/account/tenants' as const
export async function createTenantApi(body: ExtractBodyType<'post', typeof createTenantUrl>) {
  return await fetchApi.POST(createTenantUrl, { body })
}

const updateTenantUrl = '/account/tenants/{tenant_id}' as const
export async function updateTenantApi(tenantId: string, body: ExtractBodyType<'put', typeof updateTenantUrl>) {
  return await fetchApi.PUT(updateTenantUrl, { params: { path: { tenant_id: tenantId } }, body })
}

const deleteTenantUrl = '/account/tenants/{tenant_id}' as const
export async function deleteTenantApi(tenantId: string) {
  return await fetchApi.DELETE(deleteTenantUrl, { params: { path: { tenant_id: tenantId } } })
}

const addTenantUserUrl = '/account/tenants/{tenant_id}/users' as const
export async function addTenantUserApi(tenantId: string, body: ExtractBodyType<'post', typeof addTenantUserUrl>) {
  return await fetchApi.POST(addTenantUserUrl, { params: { path: { tenant_id: tenantId } }, body })
}

const updateUserRoleUrl = '/account/tenants/{tenant_id}/users/{user_id}' as const
export async function updateUserRoleApi(tenantId: string, userId: string, body: ExtractBodyType<'put', typeof updateUserRoleUrl>) {
  return await fetchApi.PUT(updateUserRoleUrl, { params: { path: { tenant_id: tenantId, user_id: userId } }, body })
}

const removeTenantUserUrl = '/account/tenants/{tenant_id}/users/{user_id}' as const
export async function removeTenantUserApi(tenantId: string, userId: string) {
  return await fetchApi.DELETE(removeTenantUserUrl, { params: { path: { tenant_id: tenantId, user_id: userId } } })
}
