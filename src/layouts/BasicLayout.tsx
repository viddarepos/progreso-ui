import Box from '@mui/material/Box'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/store'
import Footer from '../components/footer/Footer'
import Header from '../components/header/Header'
import InfoModal from '../components/shared/InfoModal'
import { selectUsersIsLoggedIn } from '../features/auth/authSelector'
import { selectProfileIsLoading } from '../features/profile/profileSelectors'
import { getCurrentUser } from '../features/profile/profileSlice'
import useLogoutUser from '../hooks/useLogoutUser'
import { getDecodedTokenData } from '../utils/functions'
import LoadingWrapper from '../wrappers/LoadingWrapper'

export default function BasicLayout() {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectUsersIsLoggedIn)
  const isCurrentUserLoading = useAppSelector(selectProfileIsLoading)
  const [showSessionExpiredInfoModal, setShowSessionExpiredInfoModal] = useState(false)
  const { logoutUser } = useLogoutUser()
  const logoutTimeout = useRef<NodeJS.Timeout>()

  const handleCloseInfoModal = () => {
    logoutUser()
    setShowSessionExpiredInfoModal(false)
  }

  useEffect(() => {
    if (isLoggedIn) {
      const decodedToken = getDecodedTokenData()
      if (decodedToken) {
        if (dayjs.unix(decodedToken.exp).isBefore(dayjs())) {
          setShowSessionExpiredInfoModal(true)
        } else {
          //difference between now and token expiry time minus 1 minute (in milliseconds)
          const timer = dayjs.unix(decodedToken.exp).diff(dayjs(), 'ms', true) - 60000
          logoutTimeout.current = setTimeout(() => {
            setShowSessionExpiredInfoModal(true)
          }, timer)
          const id = decodedToken.userId
          dispatch(getCurrentUser(id))
        }
      }
    }
    return () => clearTimeout(logoutTimeout.current)
  }, [isLoggedIn])

  return (
    <>
      <LoadingWrapper isLoading={isCurrentUserLoading} isAppLoading>
        <Header />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0',
            marginLeft: { laptop: 'calc(100vw - 100%)' },
            minHeight: 'calc(100vh - var(--heightOfHeaderAndFooter))',
            padding: { desktop: '1rem 2rem', mobile: '1rem 0.8rem' },
          }}
        >
          {<Outlet />}
        </Box>
        {isLoggedIn && <Footer />}
      </LoadingWrapper>
      <InfoModal
        title='Your session has expired.'
        content={`Please log in again to continue using our services.\n\nThank you!`}
        onClose={handleCloseInfoModal}
        open={showSessionExpiredInfoModal}
      />
    </>
  )
}
