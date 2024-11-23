'use client'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import Stack from '@mui/material/Stack'
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown'
import MenuButton from './SideMenuButton'

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'right',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <Stack direction="row" sx={{ gap: 1 }}>
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  )
}
