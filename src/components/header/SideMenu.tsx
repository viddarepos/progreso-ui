import CalendarIcon from '@mui/icons-material/CalendarMonth'
import CloseIcon from '@mui/icons-material/Close'
import EventRequestIcon from '@mui/icons-material/EditCalendar'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import GroupsIcon from '@mui/icons-material/Groups'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import TechnologiesIcon from '@mui/icons-material/Terminal'
import {
  Box,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Link } from 'react-router-dom'

import { useAppSelector } from '../../app/store'
import { selectIsCurrentUserAdmin } from '../../features/profile/profileSelectors'
import { RoutePaths } from '../../utils/enums'

import Logo from './Logo'

type Props = {
  isOpen: boolean
  closeMenu: () => void
}

export default function SideMenu({ isOpen, closeMenu }: Props) {
  const isCurrentUserAdmin = useAppSelector(selectIsCurrentUserAdmin)
  return (
    <Drawer anchor='left' open={isOpen} onClose={closeMenu}>
      <Box sx={{ minWidth: 250 }}>
        <Grid container p={1} sx={{ justifyContent: 'space-between' }}>
          <Logo />
          <CloseIcon onClick={closeMenu} sx={{ cursor: 'pointer', padding: '0.2rem' }} />
        </Grid>
        <List onClick={closeMenu}>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={RoutePaths.INDEX}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={RoutePaths.USERS}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText>Users</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={RoutePaths.CALENDAR}>
              <ListItemIcon>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText>Calendar</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={RoutePaths.EVENT_REQUESTS}>
              <ListItemIcon>
                <EventRequestIcon />
              </ListItemIcon>
              <ListItemText>Event Requests</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={RoutePaths.ABSENCE_TRACKING}>
              <ListItemIcon>
                <EventBusyIcon />
              </ListItemIcon>
              <ListItemText>Absence Tracking</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={RoutePaths.SEASONS}>
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText>Seasons</ListItemText>
            </ListItemButton>
          </ListItem>
          {isCurrentUserAdmin && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to={RoutePaths.TECHNOLOGIES}>
                <ListItemIcon>
                  <TechnologiesIcon />
                </ListItemIcon>
                <ListItemText>Technologies</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  )
}
