import { type ExtractBodyType, fetchPublicApi } from '@/apis/core'

export const loginUrl = '/auth/login' as const
export async function loginApi(body: ExtractBodyType<'post', typeof loginUrl>) {
  return await fetchPublicApi.POST(loginUrl, { body })
}

export const signupUrl = '/auth/signup' as const
export async function signupApi(body: ExtractBodyType<'post', typeof signupUrl>) {
  return await fetchPublicApi.POST(signupUrl, { body })
}

export const signupVerifyUrl = '/auth/signup_verify' as const
export async function signupVerifyApi(body: ExtractBodyType<'post', typeof signupVerifyUrl>) {
  return await fetchPublicApi.POST(signupVerifyUrl, { body })
}

export const activateAccountUrl = '/auth/activate_account'
export async function activateAccountApi(body: ExtractBodyType<'post', typeof activateAccountUrl>) {
  return await fetchPublicApi.POST(activateAccountUrl, { body })
}

export const activateAccountVerifyUrl = '/auth/activate_account_verify'
export async function activateAccountVerifyApi(body: ExtractBodyType<'post', typeof activateAccountVerifyUrl>) {
  return await fetchPublicApi.POST(activateAccountVerifyUrl, { body })
}

export const forgotPasswordUrl = '/auth/forgot_password'
export async function forgotPasswordApi(body: ExtractBodyType<'post', typeof forgotPasswordUrl>) {
  return await fetchPublicApi.POST(forgotPasswordUrl, { body })
}

export const resetPasswordUrl = '/auth/reset_password'
export async function resetPasswordApi(body: ExtractBodyType<'post', typeof resetPasswordUrl>) {
  return await fetchPublicApi.POST(resetPasswordUrl, { body })
}

export const resendVerificationCodeUrl = '/auth/resend_verification_code'
export async function resendVerificationCodeApi(body: ExtractBodyType<'post', typeof resendVerificationCodeUrl>) {
  return await fetchPublicApi.POST(resendVerificationCodeUrl, { body })
}

export const logoutUrl = '/auth/logout'
export async function logoutApi() {
  return await fetchPublicApi.POST(logoutUrl)
}
