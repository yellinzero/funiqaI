import type { ExtractResponseType } from '@/apis/core'
import type {
  addTenantUserUrl,
  createTenantUrl,
  deleteTenantUrl,
  getAccountInfoUrl,
  getAccountTenantsUrl,
  removeTenantUserUrl,
  updateTenantUrl,
  updateUserRoleUrl,
} from '@/apis/paths'

export type IGetAccountInfoResponse = ExtractResponseType<'get', typeof getAccountInfoUrl>
export type IGetAccountTenantsResponse = ExtractResponseType<'get', typeof getAccountTenantsUrl>
export type ICreateTenantResponse = ExtractResponseType<'post', typeof createTenantUrl>
export type IUpdateTenantResponse = ExtractResponseType<'put', typeof updateTenantUrl>
export type IDeleteTenantResponse = ExtractResponseType<'delete', typeof deleteTenantUrl>
export type IAddTenantUserResponse = ExtractResponseType<'post', typeof addTenantUserUrl>
export type IUpdateUserRoleResponse = ExtractResponseType<'put', typeof updateUserRoleUrl>
export type IRemoveTenantUserResponse = ExtractResponseType<'delete', typeof removeTenantUserUrl>
