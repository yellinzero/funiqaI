import type { UseDateFieldProps } from '@mui/x-date-pickers/DateField'
import type {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from '@mui/x-date-pickers/models'
import type { Dayjs } from 'dayjs'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import Button from '@mui/material/Button'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import * as React from 'react'

interface ButtonFieldProps
  extends UseDateFieldProps<Dayjs, false>,
  BaseSingleInputFieldProps<
      Dayjs | null,
    Dayjs,
    FieldSection,
    false,
    DateValidationError
  > {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const emptyObject = {} as any
function ButtonField(props: ButtonFieldProps) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = emptyObject,
    inputProps: { 'aria-label': ariaLabel } = emptyObject,
  } = props

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      size="small"
      onClick={() => setOpen?.(prev => !prev)}
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content' }}
    >
      {label ? `${label}` : 'Pick a date'}
    </Button>
  )
}

export default function CustomDatePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2023-04-17'))
  const [open, setOpen] = React.useState(false)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        label={value == null ? null : value.format('MMM DD, YYYY')}
        onChange={newValue => setValue(newValue)}
        slots={{ field: ButtonField }}
        slotProps={{
          field: { setOpen } as any,
          nextIconButton: { size: 'small' },
          previousIconButton: { size: 'small' },
        }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        views={['day', 'month', 'year']}
      />
    </LocalizationProvider>
  )
}
