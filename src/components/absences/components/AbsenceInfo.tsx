import CloseIcon from '@mui/icons-material/Close'
import { Link } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../../app/store'
import { selectAbsence, selectLoadingType } from '../../../features/absence/absenceSelectors'
import { getAbsenceById } from '../../../features/absence/absenceSlice'
import {
  selectUser,
  selectIsLoading as selectUserIsLoading,
} from '../../../features/users/usersSelectors'
import { getUserById } from '../../../features/users/usersSlice'
import { AbsenceSliceActionTypePrefix, AbsenceStatus, RoutePaths } from '../../../utils/enums'
import { setCapitalizedAbsenceType } from '../../../utils/functions'
import LoadingWrapper from '../../../wrappers/LoadingWrapper'

type Props = {
  absenceId: number | null
  onClose: () => void
}

const getAbsenceStatusColor = (status: string) => {
  switch (status) {
    case AbsenceStatus.APPROVED:
      return 'success.600'
    case AbsenceStatus.PENDING:
      return 'warning.main'
    default:
      return ''
  }
}

export default function AbsenceInfo({ absenceId, onClose }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const absence = useAppSelector(selectAbsence)
  const requester = useAppSelector(selectUser)
  const loadingType = useAppSelector(selectLoadingType)
  const isAbsenceLoading = loadingType === AbsenceSliceActionTypePrefix.ABSENCE_GET_ONE
  const isUserLoading = useAppSelector(selectUserIsLoading)

  useEffect(() => {
    absenceId && dispatch(getAbsenceById(absenceId))
  }, [absenceId])

  useEffect(() => {
    if (absence?.requesterId) {
      dispatch(getUserById(absence.requesterId))
    }
  }, [absence?.requesterId])

  const handleRequesterNameClick = () => {
    navigate(`${RoutePaths.PROFILE}/${requester?.id}`)
  }

  if (!absence || !absenceId) {
    return null
  }

  return (
    <LoadingWrapper isLoading={isUserLoading || isAbsenceLoading}>
      <Dialog
        open={!!absenceId}
        onClose={onClose}
        sx={{
          '& .MuiPaper-root': {
            maxWidth: '550px',
            width: '95vw',
          },
          zIndex: '9999',
        }}
      >
        <DialogTitle
          sx={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between' }}
        >
          <Box
            sx={{
              '@media(max-width: 500px)': {
                flexDirection: 'column-reverse',
              },
              alignItems: 'flex-start',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box>
              <Typography fontSize={'1.125rem'} fontWeight={700} paddingTop={0.7}>
                {absence.title}
              </Typography>
              <Typography
                sx={{
                  color: getAbsenceStatusColor(absence.status),
                }}
              >
                {absence.status}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Description:{' '}
            {absence.description.length > 0 ? (
              absence.description
            ) : (
              <Typography component='span' sx={{ color: 'grey.500' }}>
                (none)
              </Typography>
            )}
          </Typography>
          <Typography>
            Requester:{' '}
            <Link
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },

                color: 'inherit',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: '0.3s all',
              }}
              onClick={handleRequesterNameClick}
            >
              {requester?.fullName}
            </Link>
          </Typography>
          <Typography>Absence type: {setCapitalizedAbsenceType(absence.absenceType)}</Typography>
          <Typography>
            Period: {absence.startTime.toString()} &mdash; {absence.endTime.toString()}
          </Typography>
        </DialogContent>
      </Dialog>
    </LoadingWrapper>
  )
}
