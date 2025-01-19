'use client'
import type { IGetAccountInfoResponse } from '@/apis/types'

import { Avatar, Box, Stack, Typography } from '@mui/material'

interface IUserInfoBoxProps {
  userInfo?: IGetAccountInfoResponse
  width?: number
  height?: number
  showName?: boolean
  showEmail?: boolean
}

export default function CurrentUserInfoBox({
  userInfo,
  width = 36,
  height = 36,
  showName = false,
  showEmail = false,
}: IUserInfoBoxProps) {
  return (
    userInfo
      ? (
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <Avatar
              sizes="small"
              alt={userInfo?.name ?? ''}
              src={userInfo?.avatar ?? ''}
              sx={{ width, height }}
            />
            <Box sx={{ mr: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, justifyContent: 'center' }}>
              {showName && (
                <Typography variant="body2">
                  {userInfo?.name}
                </Typography>
              )}
              {showEmail && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {userInfo?.email}
                </Typography>
              )}
            </Box>
          </Stack>
        )
      : null
  )
}
