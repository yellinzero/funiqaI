import { i18nCookieName, languagesOptions } from '@/plugins/i18n/settings'
import TranslateIcon from '@mui/icons-material/Translate'
import { Box, List, ListItemButton, ListItemText, Popover, Stack } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'

export default function LangSelect() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
  const [selectedIndex, setSelectedIndex] = React.useState<string>()

  const open = Boolean(anchorEl)
  const router = useRouter()
  const [_cookie, setCookie] = useCookies()
  const { i18n } = useTranslation()
  const currLangLabel = languagesOptions.find(option => option.value === i18n.language)?.label || 'English'

  function handleListItemClick(
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    locale: string,
  ) {
    setSelectedIndex(locale)
    changeLanguage(locale)
    handleClose()
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang)
    setCookie(i18nCookieName, lang, { path: '/' })
    router.refresh()
  }

  return (
    <>
      <Stack
        spacing={1}
        direction="row"
        sx={{
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <TranslateIcon sx={{ fontSize: '16px' }} />
        <Box
          component="span"
          sx={{
            padding: '8px 0px',
          }}
        >
          {currLangLabel}
        </Box>
      </Stack>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <List
          component="nav"
        >
          {languagesOptions.map(
            option => (
              <ListItemButton
                key={option.value}
                selected={selectedIndex === option.value}
                onClick={event => handleListItemClick(event, option.value)}
              >
                <ListItemText primary={option.label} />
              </ListItemButton>
            ),
          )}
        </List>
      </Popover>
    </>

  )
}
