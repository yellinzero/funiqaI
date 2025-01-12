import AuthHeader from '@/app/(auth)/components/AuthHeader'
import Box from '@mui/material/Box'

export default function AuthLayout(props: {
  children: React.ReactNode
}) {
  const { children } = props

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        backgroundColor: 'background.default',
        overflow: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <AuthHeader />

      <Box
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
