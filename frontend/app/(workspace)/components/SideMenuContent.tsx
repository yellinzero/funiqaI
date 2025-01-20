'use client'
import { AccountTree, Hub, QuestionAnswer, Storefront } from '@mui/icons-material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'

interface Props {
  expanded: boolean
  showContent: boolean
}

export default function SideMenuContent({ expanded, showContent }: Props) {
  const { t } = useTranslation()
  const mainListItems = [
    { text: t('chats', { ns: 'global' }), icon: <QuestionAnswer /> },
    { text: t('workflows', { ns: 'global' }), icon: <AccountTree /> },
    { text: t('store', { ns: 'global' }), icon: <Storefront /> },
    { text: t('integrationHub', { ns: 'global' }), icon: <Hub /> },
  ]

  return (
    <Stack sx={{ flexGrow: 1, px: 1, justifyContent: 'space-between', width: '100%' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            {expanded ? (
              <ListItemButton selected={index === 0} sx={{ height: 36 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                {showContent && <ListItemText primary={item.text} />}
              </ListItemButton>
            ) : (
              <Tooltip title={item.text} placement="right">
                <ListItemButton
                  selected={index === 0}
                  sx={{
                    width: 36,
                    height: 36,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}
