'use client'
import { loginApi } from '@/apis/modules/auth'
import LangSelect from '@/components/LangSelect'
// import { FacebookIcon, GoogleIcon } from '@/components/CustomIcons'
import { SiteLogo } from '@/components/SiteLogo'
import Toast from '@/components/Toast'
import { getLangOnClient } from '@/plugins/i18n/client'
import ColorModeSelect from '@/theme/ColorModeSelect'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
// import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const LoginContainer = styled(Stack)(({ theme }) => ({
  'height': 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  'minHeight': '100%',
  'padding': theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}))

export default function Login() {
  const { t } = useTranslation('global')
  const [emailError, setEmailError] = React.useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('')
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError) {
      event.preventDefault()
      return
    }
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const langCookie = getLangOnClient()
    await loginApi({
      email: data.get('email') as string,
      password: data.get('password') as string,
      language: langCookie,
    })
  }

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement
    const password = document.getElementById('password') as HTMLInputElement

    let isValid = true

    if (!email.value || !/\S[^\s@]*@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage(t('enter_valid_email'))
      isValid = false
    }
    else {
      setEmailError(false)
      setEmailErrorMessage('')
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage(t('enter_valid_password'))
      isValid = false
    }
    else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    return isValid
  }

  return (
    <LoginContainer direction="column" justifyContent="space-between">
      <Box sx={{ display: 'flex', alignItems: 'center', position: 'fixed', top: '1rem', right: '1rem', gap: 1 }}>
        <LangSelect />
        <ColorModeSelect />
      </Box>

      <Card variant="outlined">
        <SiteLogo />
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          {t('sign_in')}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">{t('email')}</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">{t('password')}</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            {t('sign_in')}
          </Button>
          {/* <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Forgot your password?
          </Link> */}
        </Box>
        {/* <Divider>or</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => console.log('Sign in with Google')}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => console.log('Sign in with Facebook')}
            startIcon={<FacebookIcon />}
          >
            Sign in with Facebook
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?
            {' '}
            <Link
              href="/material-ui/getting-started/templates/sign-in/"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box> */}
      </Card>
    </LoginContainer>
  )
}
