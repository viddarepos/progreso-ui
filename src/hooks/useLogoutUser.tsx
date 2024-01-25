import { useAppDispatch } from '../app/store'
import { logout } from '../features/auth/authSlice'
import { clearCurrentUser } from '../features/profile/profileSlice'
import { STORAGE_ACCESS_TOKEN_KEY } from '../utils/constants'

export default function useLogoutUser() {
  const dispatch = useAppDispatch()
  const logoutUser = () => {
    localStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY)
    dispatch(logout())
    dispatch(clearCurrentUser())
  }
  return { logoutUser }
}
