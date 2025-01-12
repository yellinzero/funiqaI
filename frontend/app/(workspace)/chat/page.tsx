'use client'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function Chat() {
  const { t } = useTranslation()
  return (
    <Box>
      {t('welcome', {
        name: t('product_name'),
      })}
    </Box>
  )
}
