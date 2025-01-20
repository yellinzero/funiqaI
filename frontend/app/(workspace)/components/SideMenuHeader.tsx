'use client'
import Stack from '@mui/material/Stack'
import { Logo, LogoWithName } from '@/components/SiteLogo'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'

interface Props {
  expanded: boolean
  onToggle: () => void
}

export default function SideMenuHeader({ expanded, onToggle }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        p: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: expanded ? 'space-between' : 'center',
      }}
    >
      {expanded ? (
        <LogoWithName height={36} />
      ) : (
        <Box onClick={onToggle} sx={{ cursor: 'pointer', height: 36, width: 36 }}>
          <Logo height={36} width={36} />
        </Box>
      )}

      {expanded && (
        <IconButton
          onClick={onToggle}
          disableRipple
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'none'
          }}
        >
          <AiOutlineMenuFold />
        </IconButton>
      )}
    </Stack>
  )
}
