'use client'
import type { AlertProps, SnackbarProps } from '@mui/material'
import { Alert, Snackbar } from '@mui/material'
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

export interface IToastProps {
  duration?: number
  message: string
  type?: AlertProps['severity']
  variant?: AlertProps['variant']
  color?: AlertProps['color']
  icon?: AlertProps['icon']
  needClose?: boolean
  anchorOrigin?: SnackbarProps['anchorOrigin']
}
function Toast({
  duration = 6000,
  anchorOrigin,
  type = 'info',
  variant,
  icon,
  needClose = false,
  message,
}: IToastProps) {
  const [open, setOpen] = useState(true)
  const resolvedAnchorOrigin = anchorOrigin ?? {
    vertical: 'top',
    horizontal: 'center',
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={resolvedAnchorOrigin}
      message={message}
      autoHideDuration={duration}
    >
      <Alert
        onClose={needClose ? handleClose : undefined}
        severity={type}
        variant={variant}
        icon={icon}
        sx={{ width: '100%' }}
      >
        { message }
      </Alert>
    </Snackbar>
  )
}

Toast.notify = (props: IToastProps) => {
  if (typeof window === 'object') {
    const holder = document.createElement('div')
    const root = createRoot(holder)

    root.render(<Toast {...props} />)
    document.body.appendChild(holder)
    setTimeout(() => {
      if (holder)
        holder.remove()
    }, props.duration ?? 3000)
  }
}

Toast.success = (props: Omit<IToastProps, 'type'>) => {
  Toast.notify({
    ...props,
    type: 'success',
  })
}

Toast.info = (props: Omit<IToastProps, 'type'>) => {
  Toast.notify({
    ...props,
    type: 'info',
  })
}

Toast.error = (props: Omit<IToastProps, 'type'>) => {
  Toast.notify({
    ...props,
    type: 'error',
  })
}

Toast.warning = (props: Omit<IToastProps, 'type'>) => {
  Toast.notify({
    ...props,
    type: 'warning',
  })
}

export default Toast
