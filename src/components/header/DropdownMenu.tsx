import { Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppSelector } from '../../app/store'
import { selectCurrentUserProfile } from '../../features/profile/profileSelectors'
import useLogoutUser from '../../hooks/useLogoutUser'
import { RoutePaths } from '../../utils/enums'
import { ChangePasswordModal } from '../users/components/ChangePasswordModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
  anchor: SVGElement | HTMLDivElement | null
}

export default function DropdownMenu({ isOpen, handleClose, anchor }: Props) {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const currentUser = useAppSelector(selectCurrentUserProfile)
  const navigate = useNavigate()
  const { logoutUser } = useLogoutUser()

  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true)
    handleClose()
  }
  const closeChangePasswordModal = () => setIsChangePasswordModalOpen(false)

  const handleLogout = () => {
    logoutUser()
  }

  const handleProfilePage = () => {
    currentUser && navigate(`${RoutePaths.PROFILE}/${currentUser.id}`)
    handleClose()
  }

  return (
    <>
      <Menu id='user-menu' anchorEl={anchor} open={isOpen} onClose={handleClose}>
        <MenuItem onClick={handleProfilePage}>Profile</MenuItem>
        <MenuItem onClick={openChangePasswordModal}>Change password</MenuItem>
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={closeChangePasswordModal} />
    </>
  )
}
