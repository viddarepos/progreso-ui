import { Stack } from '@mui/material'
import { type ReactNode, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../app/store'
import Snackbar from '../components/Snackbar'
import { selectAlerts } from '../features/alerts/alertsSelectors'
import { clearAllAlerts } from '../features/alerts/alertsSlice'
import { selectUsersIsLoggedIn } from '../features/auth/authSelector'

type Props = {
  children: ReactNode
}

export const SnackbarWrapper = ({ children }: Props) => {
  const dispatch = useAppDispatch()
  const alerts = useAppSelector(selectAlerts)
  const isUserLoggedIn = useAppSelector(selectUsersIsLoggedIn)
  useEffect(() => {
    if (!isUserLoggedIn) {
      dispatch(clearAllAlerts())
    }
  }, [isUserLoggedIn])
  return (
    <>
      {children}
      <Stack
        spacing={1}
        sx={{ bottom: 20, left: 10, minWidth: '280px', position: 'fixed', zIndex: 1500 }}
      >
        {alerts.map((alert) => (
          <Snackbar key={alert.id} id={alert.id} type={alert.type} message={alert.message} />
        ))}
      </Stack>
    </>
  )
}
