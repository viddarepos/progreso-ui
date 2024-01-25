import MenuIcon from '@mui/icons-material/Menu'
import { Grid } from '@mui/material'
import { useState } from 'react'
import type { MouseEvent } from 'react'

import { useAppSelector } from '../../app/store'
import { selectCurrentUserProfile } from '../../features/profile/profileSelectors'
import UserAvatar from '../shared/UserAvatar'

import DropdownMenu from './DropdownMenu'
import Logo from './Logo'
import SideMenu from './SideMenu'

const iconButtonStyles = {
  cursor: 'pointer',
  fontSize: '2.5rem',
}

const iconContainerStyles = {
  color: 'primary.main',
}

export default function Header() {
  const [isSideMenuOpened, setIsSideMenuOpened] = useState(false)
  const [isDropdownMenuOpened, setIsDropDownMenuOpened] = useState(false)
  const [dropdownAnchor, setDropdownAnchor] = useState<null | SVGElement | HTMLDivElement>(null)

  const currentUser = useAppSelector(selectCurrentUserProfile)

  const openSideMenu = () => setIsSideMenuOpened(true)

  const closeSideMenu = () => setIsSideMenuOpened(false)

  const openDropdownMenu = (event: MouseEvent<HTMLDivElement | SVGElement>) => {
    setIsDropDownMenuOpened(true)
    setDropdownAnchor(event.currentTarget)
  }

  const closeDropdownMenu = () => setIsDropDownMenuOpened(false)

  return (
    <>
      <Grid
        component='header'
        container
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem',
        }}
      >
        <Grid item sx={iconContainerStyles}>
          <MenuIcon sx={iconButtonStyles} onClick={openSideMenu} />
        </Grid>
        <Grid item sx={{ marginRight: 'auto' }}>
          <Logo hasNavigation />
        </Grid>
        <Grid item sx={iconContainerStyles}>
          <UserAvatar user={currentUser!} openDropdownMenu={openDropdownMenu} />
          <DropdownMenu
            isOpen={isDropdownMenuOpened}
            handleClose={closeDropdownMenu}
            anchor={dropdownAnchor}
          />
        </Grid>
      </Grid>
      <SideMenu isOpen={isSideMenuOpened} closeMenu={closeSideMenu} />
    </>
  )
}
