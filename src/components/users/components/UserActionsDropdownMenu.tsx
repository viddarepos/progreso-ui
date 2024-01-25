import ActionsIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../../app/store'
import { openModal } from '../../../features/modals/userActionsModalSlice'
import { selectIsCurrentUserAdmin } from '../../../features/profile/profileSelectors'
import { RoutePaths, Status, UserModalActions } from '../../../utils/enums'
import { type User } from '../../../utils/interfaces'

type UserActionsDropdownMenuProps = {
  user: User
}

export default function UserActionsDropdownMenu({ user }: UserActionsDropdownMenuProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const userIsAdmin = useAppSelector(selectIsCurrentUserAdmin)
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null)
  const isAccountArchived = user.account.status === Status.ARCHIVED

  const openMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setIsMenuOpened(true)
    setMenuAnchor(e.currentTarget)
  }

  const closeMenu = () => {
    setIsMenuOpened(false)
  }

  const handleProfileClick = () => {
    navigate(`${RoutePaths.PROFILE}/${user.id}`)
  }

  const handleEditClick = () => {
    dispatch(openModal({ action: UserModalActions.EDIT, user }))
    closeMenu()
  }

  const handleArchiveClick = () => {
    dispatch(openModal({ action: UserModalActions.ARCHIVE, user }))
    closeMenu()
  }

  const handleDeleteClick = () => {
    dispatch(openModal({ action: UserModalActions.DELETE, user }))
    closeMenu()
  }

  return (
    <>
      <IconButton onClick={openMenu}>
        <ActionsIcon />
      </IconButton>
      <Menu id='user-menu' anchorEl={menuAnchor} open={isMenuOpened} onClose={closeMenu}>
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        {userIsAdmin && [
          !isAccountArchived && (
            <MenuItem key={UserModalActions.EDIT} onClick={handleEditClick}>
              Edit User
            </MenuItem>
          ),
          user.id !== 1 && !isAccountArchived && (
            <MenuItem key={UserModalActions.ARCHIVE} onClick={handleArchiveClick}>
              Archive User
            </MenuItem>
          ),
          <MenuItem
            key={UserModalActions.DELETE}
            onClick={handleDeleteClick}
            sx={{
              color: 'error.dark',
            }}
          >
            Delete User
          </MenuItem>,
        ]}
      </Menu>
    </>
  )
}
