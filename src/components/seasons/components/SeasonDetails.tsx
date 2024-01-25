import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import { Fragment, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../../app/store'
import { setAlert } from '../../../features/alerts/alertsSlice'
import { selectCurrentUserProfile } from '../../../features/profile/profileSelectors'
import {
  selectDeleteSeasonModalOpen,
  selectSeason,
  selectSeasonIsDeleted,
  selectSeasonIsLoading,
  selectSeasonsError,
} from '../../../features/seasons/seasonsSelectors'
import {
  clearId,
  clearIsDeleted,
  clearSeasonsError,
  deleteSeason,
  getSeasonById,
  toggleModal,
} from '../../../features/seasons/seasonsSlice'
import {
  AlertErrorMessages,
  AlertSuccessMessages,
  AlertType,
  Role,
  RoutePaths,
} from '../../../utils/enums'
import { formatSeasonDuration } from '../../../utils/functions'
import LoadingWrapper from '../../../wrappers/LoadingWrapper'
import ConfirmationModal from '../../shared/ConfirmationModal'

import './SeasonDetails.scss'

const listItemStyle = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: {
    mobile: 'column',
    tablet: 'row',
  },
  gap: '0.5rem',
}

const namesListStyle = {
  color: 'grey.500',
  textAlign: {
    desktop: 'left',
    mobile: 'center',
    tablet: 'left',
  },
}

export default function SeasonDetails() {
  const season = useAppSelector(selectSeason)
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectSeasonIsLoading)
  const isConfirmationModalOpen = useAppSelector(selectDeleteSeasonModalOpen)
  const isDeleted = useAppSelector(selectSeasonIsDeleted)
  const error = useAppSelector(selectSeasonsError)
  const currentUser = useAppSelector(selectCurrentUserProfile)
  const navigate = useNavigate()

  useEffect(() => {
    id && dispatch(getSeasonById(id))
  }, [id])

  const toggleConfirmationModal = () => {
    dispatch(toggleModal())
  }

  const handleDeleteSeason = () => {
    dispatch(deleteSeason({ seasonId: Number(season?.id) }))
  }

  useEffect(() => {
    if (isDeleted) {
      dispatch(setAlert({ message: AlertSuccessMessages.SEASONS_DELETE, type: AlertType.SUCCESS }))
      dispatch(clearIsDeleted())
      dispatch(toggleModal())
      dispatch(clearId())
      navigate(RoutePaths.SEASONS)
    } else if (error) {
      const errorMessage = typeof error === 'string' ? error : AlertErrorMessages.SEASONS_DELETE
      dispatch(setAlert({ message: errorMessage, type: AlertType.ERROR }))
      dispatch(clearSeasonsError())
    }
  }, [isDeleted, error])

  const showButtons =
    currentUser?.account.role === Role.ADMIN || season?.owner.account.id === currentUser?.account.id

  return (
    <>
      <LoadingWrapper isLoading={isLoading}>
        <Box
          sx={{
            margin: {
              mobile: '0',
              tablet: 'auto',
            },
            maxWidth: '750px',
            padding: '0.5rem',
            width: '100%',
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              padding: '15px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant='subtitle1' sx={{ fontWeight: '600' }}>
                {season?.name}
              </Typography>
              <Typography variant='subtitle2' sx={{ color: 'grey.500' }}>
                {season?.durationType &&
                  formatSeasonDuration(
                    Number(`${season?.durationValue}`),
                    `${season?.durationType}`
                  )}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderTop: '2px solid grey.400' }} />
          <List>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Start date:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2' sx={{ color: 'grey.500' }}>
                    {season?.startDate}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>End date:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2' sx={{ color: 'grey.500' }}>
                    {season?.endDate}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Technologies:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2' sx={namesListStyle}>
                    {season?.technologies.map((tech) => tech.name).join(', ')}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Mentors:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2' sx={namesListStyle}>
                    {season?.mentors.map((mentor, index) => (
                      <Fragment key={mentor.id}>
                        {index > 0 && ', '}
                        <Tooltip title={`Go to ${mentor.fullName}'s profile ?`} key={mentor.id}>
                          <Link className='linkHover' to={`${RoutePaths.PROFILE}/${mentor.id}`}>
                            {mentor.fullName}
                          </Link>
                        </Tooltip>
                      </Fragment>
                    ))}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Interns:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2' sx={namesListStyle}>
                    {season?.interns.map((intern, index) => (
                      <Fragment key={intern.id}>
                        {index > 0 && ', '}
                        <Tooltip title={`Go to ${intern.fullName}'s profile ?`} key={intern.id}>
                          <Link className='linkHover' to={`${RoutePaths.PROFILE}/${intern.id}`}>
                            {intern.fullName}
                          </Link>
                        </Tooltip>
                      </Fragment>
                    ))}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Owner:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2' sx={{ color: 'grey.500' }}>
                    <Tooltip title={`Go to ${season?.owner.fullName}'s profile ?`}>
                      <Link className='linkHover' to={`${RoutePaths.PROFILE}/${season?.owner.id}`}>
                        {season?.owner.fullName}
                      </Link>
                    </Tooltip>
                  </Typography>
                }
              />
            </ListItem>
          </List>
          <Divider sx={{ borderTop: '1px solid  grey.400' }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginTop: '10px',
            }}
          >
            {showButtons && (
              <>
                <Tooltip title={'Delete this season'}>
                  <IconButton aria-label='delete' onClick={toggleConfirmationModal}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={'Update this season'}>
                  <IconButton aria-label='update'>
                    {/* TODO: functionality to navigate to the page for creating a Season when it's ready */}
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      </LoadingWrapper>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={toggleConfirmationModal}
        onConfirm={handleDeleteSeason}
        isLoading={isLoading}
        title='Delete season?'
        content={`Are you sure you want to delete this season?\nThis action cannot be undone.`}
        confirmButtonText='Yes'
      />
    </>
  )
}
