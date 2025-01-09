'use client'
import { resendVerificationCodeApi, signupVerifyApi } from '@/apis'
import LangSelect from '@/components/LangSelect'
import { SiteLogo } from '@/components/SiteLogo'
import Toast from '@/components/Toast'
import VerificationCodeForm from '@/components/VerificationCodeForm'
import { useCountdown } from '@/hooks/useCountdown'
import { useSession } from '@/plugins/session'
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
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
  const { t } = useTranslation()
  const { setSession } = useSession()
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

  const handleVerifyEmailSuccess = (accessToken: string) => {
    if (accessToken) {
      setSession(accessToken)
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
      handleVerifyEmailSuccess(res.data.access_token)
    }
  }

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        backgroundColor: 'background.default',
        overflow: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        width: '100%',
        top: '0',
        padding: '12px',
      }}
      >
        <SiteLogo />
        <LangSelect />
      </Box>

      <Box
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
          width: '100%',
        }}
      >
        <Card sx={{ height: '70%' }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: '1.5rem' }}
          >
            {t('welcome', {
              name: t('product_name'),
            })}
          </Typography>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            {showVerifyEmail ? t('verify_email') : t('sign_up')}
          </Typography>
          {showVerifyEmail
            ? (
                <VerificationCodeForm
                  onSubmit={handleVerificationSubmit}
                  submitButtonText="verify"
                  countdown={countdown}
                  onResend={handleResendCode}
                  errorMessage="verification_failed"
                />
              )
            : (
                <SignUpForm onSuccess={handleSignUpSuccess} />
              )}
        </Card>
      </Box>
    </Box>
  )
}
