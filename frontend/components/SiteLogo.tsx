import Logo from '@/assets/icons/logo.svg?url'
import LogoGraySvg from '@/assets/icons/logo-gray.svg?url'
import LogoWhiteSvg from '@/assets/icons/logo-white.svg?url'
import Cookies from 'js-cookie'
import Image from 'next/image'

export function LogoWithName() {
  // Get theme from cookies on server side
  const theme = Cookies.get('theme') || 'light'

  return theme === 'dark'
    ? <Image src={LogoWhiteSvg} height={40} style={{ objectFit: 'contain' }} alt="Logo" />
    : <Image src={LogoGraySvg} height={40} style={{ objectFit: 'contain' }} alt="Logo" />
}

export { Logo }
