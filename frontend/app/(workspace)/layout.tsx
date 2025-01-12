import MobileNavbar from '@/app/(workspace)/components/MobileNavbar'
import SideMenu from '@/app/(workspace)/components/SideMenu'
import Header from '@/app/(workspace)/components/WorkspaceHeader'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <SideMenu />
      <MobileNavbar />
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          overflow: 'auto',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },

          }}
        >
          <Header />
          {children}
        </Stack>
      </Box>
    </Box>
  )
}
