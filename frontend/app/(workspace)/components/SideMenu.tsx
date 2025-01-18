'use client'
import UserInfoBox from '@/components/UserInfoBox'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import SideMenuContent from './SideMenuContent'
import UserActionsMenu from './UserActionsMenu'

const drawerWidth = 240
export default function SideMenu() {
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
        <UserInfoBox needName needEmail />
        <UserActionsMenu />
      </Stack>
    </Drawer>
  )
}
