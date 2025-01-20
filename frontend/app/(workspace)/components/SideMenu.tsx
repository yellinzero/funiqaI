'use client'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import SideMenuContent from './SideMenuContent'
import UserActionsMenu from './UserActionsMenu'
import SideMenuHeader from './SideMenuHeader'
import { useState, useRef } from 'react'

const expandedWidth = 240
const collapsedWidth = 64

export default function SideMenu() {
  const [expanded, setExpanded] = useState(true)
  const [transitionComplete, setTransitionComplete] = useState(true)
  const drawerRef = useRef<HTMLDivElement>(null)

  const handleTransitionEnd = (event: React.TransitionEvent) => {
    if (event.target === drawerRef.current) {
      setTransitionComplete(true)
    }
  }

  const handleToggle = () => {
    setTransitionComplete(false)
    setExpanded(!expanded)
  }

  return (
    <Drawer
      variant="permanent"
      ref={drawerRef}
      onTransitionEnd={handleTransitionEnd}
      sx={{
        width: expanded ? expandedWidth : collapsedWidth,
        transition: theme => theme.transitions.create('width'),
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
          width: expanded ? expandedWidth : collapsedWidth,
          transition: theme => theme.transitions.create('width'),
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowX: 'hidden',
        },
      }}
    >
      <SideMenuHeader expanded={expanded} onToggle={handleToggle} />
      <SideMenuContent expanded={expanded} showContent={transitionComplete} />
      <UserActionsMenu
        expanded={expanded}
        showContent={transitionComplete}
      />
    </Drawer>
  )
}
