import { Link, TableCell, TableRow } from '@mui/material'
import { useNavigate } from 'react-router'

import useThemeBreakpoints from '../../hooks/useThemeBreakpoints'
import { RoutePaths, Status } from '../../utils/enums'
import { setCapitalizedWord } from '../../utils/functions'
import type { User } from '../../utils/interfaces'
import UserAvatar from '../shared/UserAvatar'

import UserActionsDropdownMenu from './components/UserActionsDropdownMenu'

type UsersItemProps = {
  user: User
}

const tableCellStyle = {
  padding: {
    desktop: '16px',
    laptop: '12px',
    mobile: '8px',
    tablet: '14px',
  },
}

export default function UsersItem({ user }: UsersItemProps) {
  const navigate = useNavigate()

  const { desktopBreakpoint, tabletBreakpoint, laptopBreakpoint } = useThemeBreakpoints()

  const handleProfileClick = () => {
    navigate(`${RoutePaths.PROFILE}/${user.id}`)
  }

  return (
    <TableRow
      key={user.id}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        backgroundColor: user.account.status === Status.ARCHIVED ? 'grey.200' : 'transparent',
      }}
    >
      <TableCell
        scope='row'
        sx={{ ...tableCellStyle, cursor: 'pointer' }}
        onClick={handleProfileClick}
      >
        <UserAvatar user={user} />
      </TableCell>
      <TableCell
        sx={{ ...tableCellStyle, cursor: 'pointer' }}
        onClick={handleProfileClick}
        align='left'
      >
        {user.fullName}
      </TableCell>

      {tabletBreakpoint && (
        <>
          <TableCell sx={tableCellStyle} align='left'>
            {user?.account.role && setCapitalizedWord(user.account.role)}
          </TableCell>
          <TableCell sx={tableCellStyle} align='left'>
            {user.location}
          </TableCell>
          {desktopBreakpoint && (
            <TableCell sx={tableCellStyle} align='left'>
              <Link
                component={user.phoneNumber ? 'a' : 'span'}
                href={user.phoneNumber ? `tel:${user.phoneNumber}` : undefined}
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                  },
                  borderBottom: '1px solid currentColor',
                  color: 'common.black',
                  textDecoration: 'none',
                  transition: '0.3s all',
                }}
              >
                {user.phoneNumber}
              </Link>
            </TableCell>
          )}
          {laptopBreakpoint && (
            <TableCell sx={tableCellStyle} align='left'>
              <Link
                component={user.account.email ? 'a' : 'span'}
                href={user.account.email ? `mailto:${user.account.email}` : undefined}
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                  },
                  borderBottom: '1px solid currentColor',
                  color: 'common.black',
                  textDecoration: 'none',
                  transition: '0.3s all',
                }}
              >
                {user.account.email}
              </Link>
            </TableCell>
          )}
        </>
      )}

      <TableCell sx={{ padding: 0 }} align='left'>
        <UserActionsDropdownMenu user={user} />
      </TableCell>
    </TableRow>
  )
}
