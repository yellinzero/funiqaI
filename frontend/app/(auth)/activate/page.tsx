'use client'
import { activateAccountApi, activateAccountVerifyApi, resendVerificationCodeApi } from '@/apis'
import Toast from '@/components/Toast'
import VerificationCodeForm from '@/components/VerificationCodeForm'
import { useCountdown } from '@/hooks/useCountdown'
import { useSessionCookie } from '@/hooks/useSessionCookie'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

export default function Activate() {
  const { t } = useTranslation(['auth', 'global'])
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const { countdown, startCountdown } = useCountdown()
  const { setAuth } = useSessionCookie()
  useEffect(() => {
    const email = searchParams.get('email')
    if (!email) {
      Toast.error({ message: t('invalid_activation_link') })
      return
    }
    setEmail(email)
  }, [searchParams, router, t])

  const sendActivationEmail = async () => {
    try {
      const res = await activateAccountApi({
        email,
      })
      if (res.data?.token) {
        setToken(res.data.token)
        startCountdown()
        Toast.success({ message: t('activation_code_sent') })
      }
    }
    catch (e) {
      console.error('Send activation code error:', e)
      Toast.error({ message: t('send_code_failed') })
      router.push('/sign-in')
    }
  }

  const handleResendCode = async () => {
    try {
      await resendVerificationCodeApi({
        email,
        code_type: 'activate_account_email',
      })
      startCountdown()
      Toast.success({ message: t('activation_code_sent') })
    }
    catch (e) {
      console.error('Resend verification code error:', e)
      Toast.error({ message: t('send_code_failed') })
    }
  }

  const handleVerificationSubmit = async (code: string) => {
    const res = await activateAccountVerifyApi({ token, code })
    if (res.data) {
      setAuth(res.data.access_token, res.data.tenant_id ?? undefined)
      Toast.success({ message: t('account_activated') })
      router.push('/chat')
    }
  }

  return (
    <Card>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: '1.5rem' }}
      >
        {t('activate_account')}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {t('activation_code_description', { email })}
      </Typography>
      {!token && (
        <Button
          variant="contained"
          onClick={sendActivationEmail}
          fullWidth
        >
          {t('send_activation_code')}
        </Button>
      )}
      {token && (
        <VerificationCodeForm
          onSubmit={handleVerificationSubmit}
          submitButtonText="activate"
          countdown={countdown}
          onResend={handleResendCode}
          errorMessage="activation_failed"
        />
      )}
    </Card>
  )
}
