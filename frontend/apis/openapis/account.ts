import { type ExtractBodyType, fetchApi } from '@/apis/core'
import {
  addTenantUserUrl,
  createTenantUrl,
  deleteTenantUrl,
  getAccountInfoUrl,
  getAccountTenantsUrl,
  removeTenantUserUrl,
  updateTenantUrl,
  updateUserRoleUrl,
} from '@/apis/paths'

export async function getAccountInfoApi() {
  return await fetchApi.GET(getAccountInfoUrl)
}

export async function getAccountTenantsApi() {
  return await fetchApi.GET(getAccountTenantsUrl)
}

export async function createTenantApi(body: ExtractBodyType<'post', typeof createTenantUrl>) {
  return await fetchApi.POST(createTenantUrl, { body })
}

export async function updateTenantApi(tenantId: string, body: ExtractBodyType<'put', typeof updateTenantUrl>) {
  return await fetchApi.PUT(updateTenantUrl, { params: { path: { tenant_id: tenantId } }, body })
}

export async function deleteTenantApi(tenantId: string) {
  return await fetchApi.DELETE(deleteTenantUrl, { params: { path: { tenant_id: tenantId } } })
}

export async function addTenantUserApi(tenantId: string, body: ExtractBodyType<'post', typeof addTenantUserUrl>) {
  return await fetchApi.POST(addTenantUserUrl, { params: { path: { tenant_id: tenantId } }, body })
}

export async function updateUserRoleApi(tenantId: string, userId: string, body: ExtractBodyType<'put', typeof updateUserRoleUrl>) {
  return await fetchApi.PUT(updateUserRoleUrl, { params: { path: { tenant_id: tenantId, user_id: userId } }, body })
}

export async function removeTenantUserApi(tenantId: string, userId: string) {
  return await fetchApi.DELETE(removeTenantUserUrl, { params: { path: { tenant_id: tenantId, user_id: userId } } })
}
