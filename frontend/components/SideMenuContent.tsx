'use client'
import { Chat } from '@mui/icons-material'
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'

const mainListItems = [
  { text: 'Chat', icon: <Chat /> },
  { text: 'Workflows', icon: <AnalyticsRoundedIcon /> },
  { text: 'Store', icon: <PeopleRoundedIcon /> },
  { text: 'Library', icon: <AssignmentRoundedIcon /> },
]

export default function SideMenuContent() {
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
