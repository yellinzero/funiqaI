'use client'
import { AccountTree, Hub, QuestionAnswer, Storefront } from '@mui/icons-material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'

export default function SideMenuContent() {
  const { t } = useTranslation()
  const mainListItems = [
    { text: t('chats'), icon: <QuestionAnswer /> },
    { text: t('workflows'), icon: <AccountTree /> },
    { text: t('store'), icon: <Storefront /> },
    { text: t('integrationHub'), icon: <Hub /> },
  ]
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}
