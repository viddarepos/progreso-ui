import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '../app/store'
import { selectUsersIsLoggedIn } from '../features/auth/authSelector'
import { selectIsCurrentUserAdmin } from '../features/profile/profileSelectors'
import { RoutePaths } from '../utils/enums'

export const LoggedOutProtection = () => {
  const isLoggedIn = useAppSelector(selectUsersIsLoggedIn)

  return isLoggedIn ? <Outlet /> : <Navigate to={RoutePaths.LOGIN} />
}

export const LoggedInProtection = () => {
  const isLoggedIn = useAppSelector(selectUsersIsLoggedIn)

  return isLoggedIn ? <Navigate to={RoutePaths.INDEX} /> : <Outlet />
}

export const AdminRouteProtection = () => {
  const isAdmin = useAppSelector(selectIsCurrentUserAdmin)

  return isAdmin ? <Outlet /> : <Navigate to={RoutePaths.INDEX} />
}
