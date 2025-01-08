import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'

const resetSchema = z.object({
  code: z.string().min(6).max(6),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
})

type ResetFormInputs = z.infer<typeof resetSchema>

interface ResetFormProps {
  onSubmit: (data: ResetFormInputs) => Promise<void>
  countdown: number
  onResend: () => void
}

export default function ResetForm({ onSubmit, countdown, onResend }: ResetFormProps) {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormInputs>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: '', password: '', confirmPassword: '' },
  })

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
      <FormControl>
        <FormLabel htmlFor="code">{t('verification_code')}</FormLabel>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="code"
              type="text"
              placeholder={t('enter_code')}
              fullWidth
              variant="outlined"
              error={!!errors.code}
              helperText={errors.code ? t('invalid_verification_code', 'Invalid verification code') : undefined}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="password">{t('new_password')}</FormLabel>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="password"
              type="password"
              fullWidth
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password ? t('enter_valid_password') : undefined}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="confirmPassword">{t('confirm_password')}</FormLabel>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="confirmPassword"
              type="password"
              fullWidth
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword ? t('passwords_dont_match', 'Passwords don\'t match') : undefined}
            />
          )}
        />
      </FormControl>

      <Button type="submit" fullWidth variant="contained">
        {t('reset_password')}
      </Button>

      <Button
        variant="text"
        disabled={countdown > 0}
        onClick={onResend}
      >
        {countdown > 0
          ? t('resend_code_countdown', { seconds: countdown })
          : t('resend_code')}
      </Button>
    </Box>
  )
}
