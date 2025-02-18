'use client'
import { resendVerificationCodeApi, signupVerifyApi } from '@/apis'
import Toast from '@/components/Toast'
import VerificationCodeForm from '@/components/VerificationCodeForm'
import { useCountdown } from '@/hooks/useCountdown'
import { useSessionCookie } from '@/hooks/useSessionCookie'
import { styled } from '@mui/material'
import MuiCard from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SignUpForm from './components/SignUpForm'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
}))

export default function SignUp() {
  const { t } = useTranslation(['auth', 'global'])
  const { setAuth } = useSessionCookie()
  const router = useRouter()
  const [showVerifyEmail, setShowVerifyEmail] = useState(false)
  const [token, setToken] = useState('')
  const { countdown, startCountdown } = useCountdown()
  const [email, setEmail] = useState('')

  const handleSignUpSuccess = (token: string, userEmail: string) => {
    setShowVerifyEmail(true)
    setToken(token)
    setEmail(userEmail)
    startCountdown()
  }

  const handleVerifyEmailSuccess = (data: { access_token: string, tenant_id?: string }) => {
    if (data) {
      setAuth(data.access_token, data.tenant_id)
      router.push('/create-tenant')
    }
  }

  const handleResendCode = async () => {
    // Add resend verification code logic here
    try {
      // Call your resend API
      await resendVerificationCodeApi({ email, code_type: 'signup_email' })
      startCountdown()
    }
    catch (e) {
      console.error('Resend verification code error:', e)
    }
  }

  const handleVerificationSubmit = async (code: string) => {
    const res = await signupVerifyApi({ code, token })
    if (res.data) {
      Toast.success({ message: t('email_verified_success') })
      handleVerifyEmailSuccess({
        access_token: res.data.access_token,
        tenant_id: res.data.tenant_id ?? undefined,
      })
    }
  }

  return (
    <Card sx={{ height: '70%' }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: '1.5rem' }}
      >
        {t('welcome', {
          name: t('product_name', { ns: 'global' }),
        })}
      </Typography>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        {showVerifyEmail ? t('verify_email') : t('sign_up', { ns: 'global' })}
      </Typography>
      {showVerifyEmail
        ? (
            <VerificationCodeForm
              onSubmit={handleVerificationSubmit}
              countdown={countdown}
              onResend={handleResendCode}
            />
          )
        : (
            <SignUpForm onSuccess={handleSignUpSuccess} />
          )}
    </Card>
  )
}
