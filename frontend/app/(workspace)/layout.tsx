import { meOptions } from '@/apis'
import SideMenu from '@/app/(workspace)/components/SideMenu'
import Header from '@/app/(workspace)/components/WorkspaceHeader'
import { getQueryClient } from '@/utils/get-query-client'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(meOptions)
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <SideMenu />
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
          }}
        >
          <Header />
          {children}
        </Stack>
      </Box>
    </Box>
  )
}
