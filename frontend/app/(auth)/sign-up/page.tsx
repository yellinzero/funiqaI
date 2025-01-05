'use client'

import { signupApi } from '@/apis/modules/auth'
import LangSelect from '@/components/LangSelect'
import { SiteLogo } from '@/components/SiteLogo'
import Toast from '@/components/Toast'
import ColorModeSelect from '@/theme/ColorModeSelect'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

const signUpSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(6),
})
type SignUpFormInputs = z.infer<typeof signUpSchema>

export default function SignUp() {
  const { t, i18n } = useTranslation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      await signupApi({
        ...data,
        language: i18n.language,
      })
      Toast.success({ message: t('signup_success') })
    }
    catch (e) {
      console.error('Signup error:', e)
      Toast.error({ message: t('signup_failed') })
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', position: 'fixed', top: '1rem', right: '1rem', gap: 1 }}>
        <LangSelect />
        <ColorModeSelect />
      </Box>
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SiteLogo />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            {t('sign_up')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">{t('full_name')}</FormLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="name"
                    placeholder={t('full_name')}
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name ? t('name_required') : undefined}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">{t('email')}</FormLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    fullWidth
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email ? t('enter_valid_email') : undefined}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">{t('password')}</FormLabel>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="password"
                    type="password"
                    placeholder="••••••"
                    autoComplete="new-password"
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.email ? t('enter_valid_password') : undefined}
                  />
                )}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              {t('sign_up')}
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  )
}
