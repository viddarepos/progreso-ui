import MoreVertIcon from '@mui/icons-material/MoreVert'
import { TableCell, TableRow } from '@mui/material'
import { type MouseEvent, useState } from 'react'

import useThemeBreakpoints from '../../hooks/useThemeBreakpoints'
import { formatSeasonDuration } from '../../utils/functions'
import type { Season } from '../../utils/interfaces'

import SeasonsActionsDropdownMenu from './components/SeasonActionsDropdown'

type SeasonItemProps = {
  season: Season
}

const tableCellStyle = {
  padding: {
    desktop: '16px',
    laptop: '12px',
    mobile: '5px',
    tablet: '6px',
  },
}

export default function SeasonItem({ season }: SeasonItemProps) {
  const [isDropdownMenuOpened, setIsDropDownMenuOpened] = useState(false)
  const [dropdownAnchor, setDropdownAnchor] = useState<null | SVGElement | HTMLDivElement>(null)

  const { tabletBreakpoint, laptopBreakpoint } = useThemeBreakpoints()

  const openDropdownMenu = (e: MouseEvent<HTMLDivElement | SVGElement>) => {
    setIsDropDownMenuOpened(true)
    setDropdownAnchor(e.currentTarget)
  }

  const closeDropdownMenu = () => {
    setIsDropDownMenuOpened(!isDropdownMenuOpened)
  }

  return (
    <TableRow key={season.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell sx={tableCellStyle}>{season.name}</TableCell>
      {tabletBreakpoint && <TableCell sx={tableCellStyle}>{season.owner.fullName}</TableCell>}
      {laptopBreakpoint && (
        <TableCell sx={tableCellStyle}>
          {formatSeasonDuration(season.durationValue, season.durationType)}
        </TableCell>
      )}
      <TableCell sx={tableCellStyle}>{season.startDate}</TableCell>
      <TableCell sx={tableCellStyle}>{season.endDate}</TableCell>
      {tabletBreakpoint && (
        <TableCell sx={tableCellStyle}>{season.technologies.map((tech) => tech.name)}</TableCell>
      )}
      <TableCell sx={{ ...tableCellStyle, cursor: 'pointer' }}>
        <MoreVertIcon onClick={openDropdownMenu} />
        <SeasonsActionsDropdownMenu
          open={isDropdownMenuOpened}
          handleClose={closeDropdownMenu}
          anchor={dropdownAnchor}
          season={season}
        />
      </TableCell>
    </TableRow>
  )
}
