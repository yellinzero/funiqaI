import Logo from '@/assets/icons/logo.png'
import { Box } from '@mui/material'
import Image from 'next/image'

export function SiteLogo() {
  return (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Image src={Logo} alt="funiq ai" height={30} width={30} />
      <Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>Funiq AI</Box>
    </Box>
  )
}
