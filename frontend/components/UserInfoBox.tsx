'use client'
import { meOptions } from '@/apis'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'

interface IUserInfoBoxProps {
  width?: number
  height?: number
  needName?: boolean
  needEmail?: boolean
}

export default function UserInfoBox({ width = 36, height = 36, needName = false, needEmail = false }: IUserInfoBoxProps) {
  const { data } = useSuspenseQuery(meOptions)
  const userInfo = data?.data
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
              {needName && (
                <Typography variant="body2">
                  {userInfo?.name}
                </Typography>
              )}
              {needEmail && (
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
