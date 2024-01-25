import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import BasicLayout from '../layouts/BasicLayout'
import AbsencePage from '../pages/AbsencePage'
import CalendarPage from '../pages/CalendarPage'
import EventRequests from '../pages/EventRequests'
import Login from '../pages/Login'
import ProfilePage from '../pages/ProfilePage'
import SeasonDetailsPage from '../pages/SeasonDetailsPage'
import SeasonsPage from '../pages/SeasonsPage'
import Technologies from '../pages/Technologies'
import UsersPage from '../pages/UsersPage'
import { RoutePaths } from '../utils/enums'
import { AdminRouteProtection, LoggedInProtection, LoggedOutProtection } from '../wrappers/wrappers'

export default function Router() {
  const location = useLocation()

  useEffect(() => {
    let pageTitle = (
      location.pathname.slice(1, 2).toUpperCase() + location.pathname.slice(2)
    ).replace('-', ' ')

    if (pageTitle.includes('Profile')) {
      pageTitle = pageTitle.split('/')[0]
    }

    if (pageTitle.includes('Seasons/')) {
      pageTitle = 'Season Details'
    }

    document.title = pageTitle.length > 0 ? `Progreso | ${pageTitle}` : 'Progreso'
  }, [location.pathname])

  return (
    <Routes>
      <Route element={<LoggedOutProtection />}>
        <Route path={RoutePaths.INDEX} element={<BasicLayout />}>
          <Route path={RoutePaths.CALENDAR} element={<CalendarPage />} />
          <Route path={RoutePaths.USERS} element={<UsersPage />} />
          <Route path={`${RoutePaths.PROFILE}/:id`} element={<ProfilePage />} />
          <Route path={RoutePaths.SEASONS} element={<SeasonsPage />} />
          <Route path={`${RoutePaths.SEASONS}/:id`} element={<SeasonDetailsPage />}></Route>
          <Route path={RoutePaths.EVENT_REQUESTS} element={<EventRequests />} />
          <Route path={RoutePaths.ABSENCE_TRACKING} element={<AbsencePage />} />
          <Route element={<AdminRouteProtection />}>
            <Route path={RoutePaths.TECHNOLOGIES} element={<Technologies />} />
          </Route>
        </Route>
      </Route>
      <Route element={<LoggedInProtection />}>
        <Route path={RoutePaths.LOGIN} element={<Login />} />
      </Route>
    </Routes>
  )
}
