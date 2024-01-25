import { Menu, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../../app/store'
import { selectCurrentUserProfile } from '../../../features/profile/profileSelectors'
import { setId, toggleModal } from '../../../features/seasons/seasonsSlice'
import { Role, RoutePaths } from '../../../utils/enums'
import { type Season } from '../../../utils/interfaces'

type SeasonsActionsDropdownMenu = {
  open: boolean
  handleClose: () => void
  anchor: SVGElement | HTMLDivElement | null
  season: Season
}

export default function SeasonsActionsDropdownMenu({
  open,
  handleClose,
  anchor,
  season,
}: SeasonsActionsDropdownMenu) {
  const currentUser = useAppSelector(selectCurrentUserProfile)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const toggleDeleteSeasonModal = () => {
    dispatch(toggleModal())
    dispatch(setId(season.id))
  }

  const navigateToDetailsPage = async () => {
    navigate(`${RoutePaths.SEASONS}/${season.id}`)
  }

  const disabledDelete =
    currentUser?.account.role === Role.INTERN ||
    (currentUser?.account.role === Role.MENTOR && season.owner.id !== currentUser.id)

  return (
    <Menu id='season-menu' anchorEl={anchor} open={open} onClose={handleClose}>
      <MenuItem onClick={navigateToDetailsPage}>Details</MenuItem>
      <MenuItem
        disabled={disabledDelete}
        sx={{
          color: 'error.dark',
        }}
        onClick={toggleDeleteSeasonModal}
      >
        Delete
      </MenuItem>
    </Menu>
  )
}
