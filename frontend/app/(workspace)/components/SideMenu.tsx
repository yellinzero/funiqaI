'use client'
import { meOptions } from '@/apis'
import CurrentUserInfoBox from '@/components/CurrentUserInfoBox'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import { useSuspenseQuery } from '@tanstack/react-query'
import SideMenuContent from './SideMenuContent'
import UserActionsMenu from './UserActionsMenu'

const drawerWidth = 240
export default function SideMenu() {
  const { data } = useSuspenseQuery(meOptions)
  const userInfo = data?.data
  return (
    <Drawer
      variant="permanent"
      className="mt-10 box-border shrink-0"
      sx={{
        width: drawerWidth,
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <SideMenuContent />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CurrentUserInfoBox userInfo={userInfo} showName showEmail />
        <UserActionsMenu />
      </Stack>
    </Drawer>
  )
}
