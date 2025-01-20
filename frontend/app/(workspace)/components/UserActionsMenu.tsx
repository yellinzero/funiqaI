'use client'
import { logoutApi } from '@/apis/openapis/auth'
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
import CurrentUserInfoBox from '@/components/CurrentUserInfoBox'
import { Stack, Box } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { meOptions } from '@/apis'

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
})

interface Props {
  expanded: boolean
  showContent: boolean
}

export default function UserActionsMenu({ expanded, showContent }: Props) {
  const { data } = useSuspenseQuery(meOptions)
  const userInfo = data?.data
  const { t, i18n } = useTranslation()
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

  async function handleLogout() {
    await logoutApi()
    sessionCookie.clearAuth()
    router.push('/')
  }

  return (
    <>
      <Stack
        direction="row"
        sx={{
          p: 1,
          gap: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {expanded && showContent ? (
          <>
            <CurrentUserInfoBox userInfo={userInfo} showName showEmail />
            <MenuButton
              aria-label="Open menu"
              onClick={handleMainMenuClick}
              sx={{ borderColor: 'transparent' }}
            >
              <MoreVertRoundedIcon />
            </MenuButton>
          </>
        ) : (
          <Box onClick={handleMainMenuClick} sx={{ cursor: 'pointer' }}>
            <CurrentUserInfoBox userInfo={userInfo} />
          </Box>
        )}
      </Stack>

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
        <MenuItem onClick={handleMainMenuClose}>{t('my_account', {
          ns: 'global'
        })}</MenuItem>
        <MenuItem onClick={handleMainMenuClose}>{t('settings', {
          ns: 'global'
        })}</MenuItem>
        <MenuItem
          onClick={handleLangMenuOpen}
          sx={{
            minHeight: 36,
            [`& .${listItemIconClasses.root}`]: {
              minWidth: 36,
            },
          }}
        >
          <ListItemText>{t('language', {
            ns: 'global'
          })}</ListItemText>
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
          <ListItemText>{t('logout', {
            ns: 'global'
          })}</ListItemText>
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
