import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import type { SnackbarCloseReason } from '@mui/material'
import { Snackbar as MuiSnackbar } from '@mui/material'
import type { SyntheticEvent } from 'react'

import { useAppDispatch } from '../app/store'
import { clearAlert } from '../features/alerts/alertsSlice'
import { AlertType } from '../utils/enums'

type Props = {
  id: string
  message: string | null
  type: AlertType | null
}

export default function Snackbar({ id, type, message }: Props) {
  const dispatch = useAppDispatch()
  const handleOnClose = (_event: Event | SyntheticEvent, reason: SnackbarCloseReason) => {
    if (reason === 'timeout') {
      dispatch(clearAlert({ id }))
    }
  }

  return (
    <MuiSnackbar
      open
      autoHideDuration={3000}
      variant={type ?? undefined}
      message={
        <>
          {type === AlertType.ERROR ? <CloseIcon /> : <CheckIcon />}
          {message}
        </>
      }
      onClose={handleOnClose}
      sx={{ position: 'relative' }}
    />
  )
}
