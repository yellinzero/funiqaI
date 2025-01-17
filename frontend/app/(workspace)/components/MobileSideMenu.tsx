'use client'
import { logoutApi } from '@/apis/openapis/auth'
import { useSessionCookie } from '@/hooks/useSessionCookie'
import { useUserInfo } from '@/hooks/useUserInfo'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import Drawer, { drawerClasses } from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import SideMenuButton from './SideMenuButton'
import SideMenuContent from './SideMenuContent'

interface SideMenuMobileProps {
  open: boolean | undefined
  toggleDrawer: (newOpen: boolean) => () => void
}

export default function MobileSideMenu({ open, toggleDrawer }: SideMenuMobileProps) {
  const userInfo = useUserInfo()
  const sessionCookie = useSessionCookie()
  const router = useRouter()
  async function handleLogout() {
    await logoutApi()
    sessionCookie.clearAuth()

    router.push('/')
  }
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={userInfo?.name ?? ''}
              src={userInfo?.avatar ?? ''}
              sx={{ width: 36, height: 36 }}
            />
            <Typography component="p" variant="h6">
              {userInfo?.name ?? ''}
            </Typography>
          </Stack>
          <SideMenuButton showBadge>
            <NotificationsRoundedIcon />
          </SideMenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <SideMenuContent />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  )
}
