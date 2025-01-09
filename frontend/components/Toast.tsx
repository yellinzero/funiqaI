'use client'
import type { SnackbarProviderProps } from 'notistack'
import { enqueueSnackbar } from 'notistack'

export interface IToastProps {
  duration?: number
  message: string
  type?: SnackbarProviderProps['variant']
  needClose?: boolean
  anchorOrigin?: SnackbarProviderProps['anchorOrigin']
}

const Toast = {
  notify: (props: IToastProps) => {
    const {
      duration = 3000,
      anchorOrigin = {
        vertical: 'top',
        horizontal: 'center',
      },
      type = 'info',
      message,
    } = props

    return enqueueSnackbar(message, {
      variant: type,
      anchorOrigin,
      autoHideDuration: duration,
    })
  },

  success: (props: Omit<IToastProps, 'type'>) => {
    return Toast.notify({
      ...props,
      type: 'success',
    })
  },

  info: (props: Omit<IToastProps, 'type'>) => {
    return Toast.notify({
      ...props,
      type: 'info',
    })
  },

  error: (props: Omit<IToastProps, 'type'>) => {
    return Toast.notify({
      ...props,
      type: 'error',
    })
  },

  warning: (props: Omit<IToastProps, 'type'>) => {
    return Toast.notify({
      ...props,
      type: 'warning',
    })
  },
}

export default Toast
