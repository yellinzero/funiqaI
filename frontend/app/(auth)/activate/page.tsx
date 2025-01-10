'use client'
import { activateAccountApi, activateAccountVerifyApi, resendVerificationCodeApi } from '@/apis'
import LangSelect from '@/components/LangSelect'
import { LogoWithName } from '@/components/SiteLogo'
import Toast from '@/components/Toast'
import VerificationCodeForm from '@/components/VerificationCodeForm'
import { useCountdown } from '@/hooks/useCountdown'
import Box from '@mui/material/Box'
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
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const { countdown, startCountdown } = useCountdown()

  useEffect(() => {
    const email = searchParams.get('email')
    if (!email) {
      Toast.error({ message: t('invalid_activation_link') })
      router.push('/sign-in')
      return
    }
    setEmail(email)
  }, [searchParams, router, t])

  const sendActivationEmail = async () => {
    try {
      const res = await activateAccountApi({
        email,
        language: i18n.language,
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

  const handleActivationSuccess = () => {
    Toast.success({ message: t('account_activated') })
    router.push('/sign-in')
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
    await activateAccountVerifyApi({ token, code })
    handleActivationSuccess()
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
        <LogoWithName />
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
      </Box>
    </Box>
  )
}
