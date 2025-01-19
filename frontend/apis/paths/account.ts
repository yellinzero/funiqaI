export const getAccountInfoUrl = '/account/me' as const
export const getAccountTenantsUrl = '/account/tenants' as const
export const createTenantUrl = '/account/tenants' as const
export const updateTenantUrl = '/account/tenants/{tenant_id}' as const
export const deleteTenantUrl = '/account/tenants/{tenant_id}' as const
export const addTenantUserUrl = '/account/tenants/{tenant_id}/users' as const
export const updateUserRoleUrl = '/account/tenants/{tenant_id}/users/{user_id}' as const
export const removeTenantUserUrl = '/account/tenants/{tenant_id}/users/{user_id}' as const
