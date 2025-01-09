'use client'
import type { KeyboardEvent } from 'react'
import Toast from '@/components/Toast'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'

interface VerificationCodeFormProps {
  onSubmit: (code: string) => Promise<void>
  submitButtonText: string
  countdown: number
  onResend: () => void
  errorMessage?: string
}

const verificationCodeSchema = z.object({
  code: z.string().length(6),
})

type VerificationCodeFormInputs = z.infer<typeof verificationCodeSchema>

export default function VerificationCodeForm({
  onSubmit,
  submitButtonText,
  countdown,
  onResend,
  errorMessage = 'verification_failed',
}: VerificationCodeFormProps) {
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationCodeFormInputs>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: '',
    },
  })

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleInput = (value: string, index: number) => {
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleFormSubmit = async (data: VerificationCodeFormInputs) => {
    try {
      await onSubmit(data.code)
    }
    catch (e) {
      console.error('Verification error:', e)
      Toast.error({ message: t(errorMessage) })
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
    >
      <FormControl>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              {[0, 1, 2, 3, 4, 5].map(index => (
                <TextField
                  key={index}
                  inputRef={el => (inputRefs.current[index] = el)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center' },
                  }}
                  sx={{ width: '48px' }}
                  variant="outlined"
                  error={!!errors.code}
                  value={field.value[index] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\D/g, '')
                    const codeArray = field.value.split('')
                    codeArray[index] = newValue
                    field.onChange(codeArray.join(''))
                    handleInput(newValue, index)
                  }}
                  onKeyDown={e => handleKeyDown(e as unknown as KeyboardEvent<HTMLInputElement>, index)}
                />
              ))}
            </Box>
          )}
        />
        {errors.code && (
          <Box sx={{ mt: 1, color: 'error.main', fontSize: '0.75rem' }}>
            {t('invalid_verification_code')}
          </Box>
        )}
      </FormControl>
      <Button type="submit" fullWidth variant="contained">
        {t(submitButtonText)}
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
