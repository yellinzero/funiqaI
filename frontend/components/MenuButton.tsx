'use client'
import type { IconButtonProps } from '@mui/material/IconButton'
import Badge, { badgeClasses } from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import * as React from 'react'

export interface MenuButtonProps extends IconButtonProps {
  showBadge?: boolean
}

export default function MenuButton({
  showBadge = false,
  ...props
}: MenuButtonProps) {
  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!showBadge}
      sx={{ [`& .${badgeClasses.badge}`]: { right: 2, top: 2 } }}
    >
      <IconButton size="small" {...props} />
    </Badge>
  )
}
