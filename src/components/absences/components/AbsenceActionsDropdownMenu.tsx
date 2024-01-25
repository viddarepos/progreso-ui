import ActionsIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import type { MouseEvent } from 'react'

import { useAppSelector } from '../../../app/store'
import { selectCurrentUserProfile } from '../../../features/profile/profileSelectors'
import { type ModalData } from '../../../pages/AbsencePage'
import { ModalActions, Role } from '../../../utils/enums'
import type { Absence, Season } from '../../../utils/interfaces'

type Props = {
  absence: Absence
  seasons: Season[]
  openModal: (modalData: ModalData) => void
}

export default function AbsenceActionsDropdownMenu({ absence, seasons, openModal }: Props) {
  const currentUser = useAppSelector(selectCurrentUserProfile)

  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null)

  const isCurrentUserAbsenceRequester = currentUser?.id === absence.requesterId

  const isMentorOwnerOfSeason =
    currentUser?.account.role === Role.MENTOR &&
    seasons.some((season) => {
      return season.id === absence.seasonId && season.owner.id === currentUser?.id
    })

  const internHasAccess = currentUser?.account.role === Role.INTERN && isCurrentUserAbsenceRequester

  const mentorHasAccess = isMentorOwnerOfSeason || isCurrentUserAbsenceRequester

  const adminHasAccess = currentUser?.account.role === Role.ADMIN

  const disabledButton = internHasAccess || mentorHasAccess || adminHasAccess

  const openMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setIsMenuOpened(true)
    setMenuAnchor(e.currentTarget)
  }

  const closeMenu = () => {
    setIsMenuOpened(false)
  }

  const handleEditClick = () => {
    openModal({ action: ModalActions.EDIT, data: absence })
    closeMenu()
  }

  const handleDeleteClick = () => {
    openModal({ action: ModalActions.DELETE, id: absence.id })
    closeMenu()
  }

  return (
    <>
      <IconButton onClick={openMenu}>
        <ActionsIcon />
      </IconButton>
      <Menu id='absence-menu' anchorEl={menuAnchor} open={isMenuOpened} onClose={closeMenu}>
        <MenuItem onClick={handleEditClick} disabled={!disabledButton}>
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          disabled={!disabledButton}
          sx={{
            color: 'error.dark',
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}
