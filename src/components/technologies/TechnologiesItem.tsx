import ActionsIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import type { MouseEvent } from 'react'
import { useState } from 'react'

import type { ModalData } from '../../pages/Technologies'
import { ModalActions } from '../../utils/enums'
import type { Technology } from '../../utils/interfaces'

type Props = {
  technology: Technology
  openModal: (modalData: ModalData) => void
}

export function TechnologiesItem({ technology, openModal }: Props) {
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null)
  const openMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setIsMenuOpened(true)
    setMenuAnchor(e.currentTarget)
  }
  const closeMenu = () => {
    setIsMenuOpened(false)
  }
  const handleEditClick = () => {
    openModal({ action: ModalActions.EDIT, id: technology.id })
    closeMenu()
  }
  const handleDeleteClick = () => {
    openModal({ action: ModalActions.DELETE, id: technology.id })
    closeMenu()
  }
  return (
    <TableRow>
      <TableCell align='center'>{technology.name}</TableCell>
      <TableCell sx={{ padding: 0 }} align='center'>
        <IconButton onClick={openMenu}>
          <ActionsIcon />
        </IconButton>
        <Menu id='user-menu' anchorEl={menuAnchor} open={isMenuOpened} onClose={closeMenu}>
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          <MenuItem
            onClick={handleDeleteClick}
            sx={{
              color: 'error.dark',
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  )
}
