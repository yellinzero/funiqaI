'use client'
import { useSessionCookie } from '@/hooks/useSessionCookie'
import { I18N_COOKIE_NAME, languagesOptions } from '@/plugins/i18n/settings'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import Divider, { dividerClasses } from '@mui/material/Divider'
import { listClasses } from '@mui/material/List'
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import { paperClasses } from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import MenuButton from './SideMenuButton'

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
})

export default function UserActionsMenu() {
  const { i18n } = useTranslation()
  const [mainAnchorEl, setMainAnchorEl] = React.useState<null | HTMLElement>(null)
  const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(null)
  const mainMenuOpen = Boolean(mainAnchorEl)
  const langMenuOpen = Boolean(langAnchorEl)
  const [_cookie, setCookie] = useCookies()
  const sessionCookie = useSessionCookie()
  const router = useRouter()

  const handleMainMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMainAnchorEl(event.currentTarget)
  }

  const handleMainMenuClose = () => {
    setMainAnchorEl(null)
  }

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget)
  }

  const handleLangMenuClose = () => {
    setLangAnchorEl(null)
  }

  const handleChangeLang = (lang: string) => {
    i18n.changeLanguage(lang)
    setCookie(I18N_COOKIE_NAME, lang, { path: '/' })
    handleLangMenuClose()
    handleMainMenuClose()
    router.refresh()
  }

  function handleLogout() {
    sessionCookie.clearAuth()
    router.push('/')
  }
  return (
    <>
      <MenuButton
        aria-label="Open menu"
        onClick={handleMainMenuClick}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={mainAnchorEl}
        id="main-menu"
        open={mainMenuOpen}
        onClose={handleMainMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <MenuItem onClick={handleMainMenuClose}>My account</MenuItem>
        <MenuItem onClick={handleMainMenuClose}>Settings</MenuItem>
        <MenuItem
          onClick={handleLangMenuOpen}
          sx={{
            minHeight: 36,
            [`& .${listItemIconClasses.root}`]: {
              minWidth: 36,
            },
          }}
        >
          <ListItemText>Language</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={langAnchorEl}
        id="language-menu"
        open={langMenuOpen}
        onClose={handleLangMenuClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
        }}
      >
        {languagesOptions.map(item => (
          <MenuItem
            key={item.value}
            onClick={() => handleChangeLang(item.value)}
            selected={item.value === i18n.language}
            sx={{
              minHeight: 36,
              [`& .${listItemIconClasses.root}`]: {
                minWidth: 36,
              },
            }}
          >
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
