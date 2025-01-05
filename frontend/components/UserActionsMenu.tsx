'use client'
import { i18nCookieName, languagesOptions } from '@/plugins/i18n/settings'
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [langsMenuAnchorEl, setLangsMessnuAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const langsMenuOpen = Boolean(langsMenuAnchorEl)
  const [_cookie, setCookie] = useCookies()
  const router = useRouter()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLangsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangsMessnuAnchorEl(event.currentTarget)
  }

  const handleLangsMenuClose = () => {
    setLangsMessnuAnchorEl(null)
  }

  const handleChangeLangs = (lang: string) => {
    i18n.changeLanguage(lang)
    setCookie(i18nCookieName, lang, { path: '/' })
    handleLangsMenuClose()
    handleClose()
    router.refresh()
  }
  return (
    <>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
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
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem
          onMouseEnter={handleLangsMenuOpen}
        >
          Switch language
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleClose}
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
        anchorEl={langsMenuAnchorEl}
        open={langsMenuOpen}
        onClose={handleLangsMenuClose}
        onClick={handleLangsMenuClose}
        transformOrigin={{ horizontal: 'left', vertical: 'center' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languagesOptions.map(item => (
          <MenuItem key={item.value} onClick={() => handleChangeLangs(item.value)} selected={item.value === i18n.language}>{item.label}</MenuItem>
        ))}

      </Menu>
    </>
  )
}
