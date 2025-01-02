import { apiFetch, type ExtractBodyType } from '@/apis/core'

const loginUrl = '/auth/login'
export async function loginApi(body: ExtractBodyType<'post', typeof loginUrl>) {
  return await apiFetch.POST(loginUrl, {
    body,
  })
}

const signupUrl = '/auth/signup'
export async function signupApi(body: ExtractBodyType<'post', typeof signupUrl>) {
  return await apiFetch.POST(signupUrl, {
    body,
  })
}
