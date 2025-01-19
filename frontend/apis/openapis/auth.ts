import { type ExtractBodyType, fetchPublicApi } from '@/apis/core'
import {
  activateAccountUrl,
  activateAccountVerifyUrl,
  forgotPasswordUrl,
  loginUrl,
  logoutUrl,
  resendVerificationCodeUrl,
  resetPasswordUrl,
  signupUrl,
  signupVerifyUrl,
} from '@/apis/paths'

export async function loginApi(body: ExtractBodyType<'post', typeof loginUrl>) {
  return await fetchPublicApi.POST(loginUrl, { body })
}

export async function signupApi(body: ExtractBodyType<'post', typeof signupUrl>) {
  return await fetchPublicApi.POST(signupUrl, { body })
}

export async function signupVerifyApi(body: ExtractBodyType<'post', typeof signupVerifyUrl>) {
  return await fetchPublicApi.POST(signupVerifyUrl, { body })
}

export async function activateAccountApi(body: ExtractBodyType<'post', typeof activateAccountUrl>) {
  return await fetchPublicApi.POST(activateAccountUrl, { body })
}

export async function activateAccountVerifyApi(body: ExtractBodyType<'post', typeof activateAccountVerifyUrl>) {
  return await fetchPublicApi.POST(activateAccountVerifyUrl, { body })
}

export async function forgotPasswordApi(body: ExtractBodyType<'post', typeof forgotPasswordUrl>) {
  return await fetchPublicApi.POST(forgotPasswordUrl, { body })
}

export async function resetPasswordApi(body: ExtractBodyType<'post', typeof resetPasswordUrl>) {
  return await fetchPublicApi.POST(resetPasswordUrl, { body })
}

export async function resendVerificationCodeApi(body: ExtractBodyType<'post', typeof resendVerificationCodeUrl>) {
  return await fetchPublicApi.POST(resendVerificationCodeUrl, { body })
}

export async function logoutApi() {
  return await fetchPublicApi.POST(logoutUrl)
}
