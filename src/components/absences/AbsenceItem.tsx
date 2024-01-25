import SubjectIcon from '@mui/icons-material/Subject'
import { Link, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppSelector } from '../../app/store'
import { selectRequesters } from '../../features/requesters/requestersSelectors'
import useThemeBreakpoints from '../../hooks/useThemeBreakpoints'
import { type ModalData, absenceCellStyle } from '../../pages/AbsencePage'
import { RoutePaths } from '../../utils/enums'
import { setCapitalizedAbsenceType, setCapitalizedWord } from '../../utils/functions'
import type { Absence, Season } from '../../utils/interfaces'

import AbsenceActionsDropdownMenu from './components/AbsenceActionsDropdownMenu'
import AbsenceDescriptionPopUp from './components/AbsenceDescriptionPopUp'

type Props = {
  absence: Absence
  seasons: Season[]
  openModal: (modalData: ModalData) => void
}

export default function AbsenceItem({ absence, seasons, openModal }: Props) {
  const navigate = useNavigate()

  const [showDescriptionPopUp, setShowDescriptionPopUp] = useState(false)
  const allRequesters = useAppSelector(selectRequesters)
  const requester = allRequesters && allRequesters?.find((user) => user.id === absence.requesterId)

  const { tabletBreakpoint, laptopBreakpoint } = useThemeBreakpoints()

  const handleMouseEnter = () => {
    setShowDescriptionPopUp(true)
  }

  const handleMouseLeave = () => {
    setShowDescriptionPopUp(false)
  }

  const handleRequesterNameClick = () => {
    navigate(`${RoutePaths.PROFILE}/${absence.requesterId}`)
  }

  return (
    <TableRow key={absence.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      {tabletBreakpoint && (
        <>
          {laptopBreakpoint && (
            <>
              <TableCell scope='row' sx={absenceCellStyle}>
                {absence.title}
              </TableCell>
              <TableCell sx={{ ...absenceCellStyle, position: 'relative' }} align='left'>
                <SubjectIcon
                  sx={{
                    color: 'grey.500',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                {showDescriptionPopUp && (
                  <AbsenceDescriptionPopUp
                    description={absence.description}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                  />
                )}
              </TableCell>
            </>
          )}

          <TableCell sx={absenceCellStyle} align='left'>
            {setCapitalizedWord(absence.status)}
          </TableCell>
          <TableCell sx={absenceCellStyle} align='left'>
            {setCapitalizedAbsenceType(absence.absenceType)}
          </TableCell>
        </>
      )}

      <TableCell sx={absenceCellStyle} align='left'>
        <Link
          sx={{
            '&:hover': {
              color: 'primary.main',
            },
            borderBottom: '1px solid currentColor',
            color: 'inherit',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: '0.3s all',
          }}
          onClick={handleRequesterNameClick}
        >
          {requester?.requestor.fullName}
        </Link>
      </TableCell>
      <TableCell sx={absenceCellStyle} align='left'>
        {absence.startTime.toString()}
      </TableCell>
      <TableCell sx={absenceCellStyle} align='left'>
        {absence.endTime.toString()}
      </TableCell>
      <TableCell sx={{ padding: 0 }} align='left'>
        <AbsenceActionsDropdownMenu absence={absence} seasons={seasons} openModal={openModal} />
      </TableCell>
    </TableRow>
  )
}
