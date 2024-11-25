import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import SideMenuContent from './SideMenuContent'
import UserActionsMenu from './UserActionsMenu'

const drawerWidth = 240
export default async function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      className="mt-10 box-border shrink-0"
      sx={{
        width: drawerWidth,
        display: { xs: 'none', md: 'block' },
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
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            Riley Carter
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            riley@email.com
          </Typography>
        </Box>
        <UserActionsMenu />
      </Stack>
    </Drawer>
  )
}
