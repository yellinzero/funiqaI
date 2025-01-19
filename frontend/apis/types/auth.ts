import type { ExtractResponseType } from '@/apis/core'
import type {
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

export type ILoginResponse = ExtractResponseType<'post', typeof loginUrl>
export type ISignupResponse = ExtractResponseType<'post', typeof signupUrl>
export type ISignupVerifyResponse = ExtractResponseType<'post', typeof signupVerifyUrl>
export type IActivateAccountResponse = ExtractResponseType<'post', typeof activateAccountUrl>
export type IActivateAccountVerifyResponse = ExtractResponseType<'post', typeof activateAccountVerifyUrl>
export type IForgotPasswordResponse = ExtractResponseType<'post', typeof forgotPasswordUrl>
export type IResetPasswordResponse = ExtractResponseType<'post', typeof resetPasswordUrl>
export type IResendVerificationCodeResponse = ExtractResponseType<'post', typeof resendVerificationCodeUrl>
export type ILogoutResponse = ExtractResponseType<'post', typeof logoutUrl>
