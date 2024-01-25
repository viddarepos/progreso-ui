import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/store'
import ConfirmationModal from '../components/shared/ConfirmationModal'
import UserAvatar from '../components/shared/UserAvatar'
import UserModalForm from '../components/users/components/CreateAndEditModal'
import { setAlert } from '../features/alerts/alertsSlice'
import {
  selectIsCreateEditModalOpen,
  selectIsDeleteModalOpen,
  selectModalAction,
} from '../features/modals/userActionsModalSelectors'
import { clearModal, openModal } from '../features/modals/userActionsModalSlice'
import {
  selectCurrentUserProfile,
  selectIsCurrentUserAdmin,
} from '../features/profile/profileSelectors'
import {
  selectIsLoading,
  selectUser,
  selectUserHasError,
  selectUsersIsDeleted,
} from '../features/users/usersSelectors'
import {
  clearIsDeleted,
  clearUserError,
  deleteUser,
  getUserById,
} from '../features/users/usersSlice'
import {
  AlertErrorMessages,
  AlertSuccessMessages,
  AlertType,
  RoutePaths,
  Status,
  UserModalActions,
} from '../utils/enums'
import { setCapitalizedWord } from '../utils/functions'
import type { Technology } from '../utils/interfaces'
import LoadingWrapper from '../wrappers/LoadingWrapper'

const listItemStyle = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: {
    mobile: 'column',
    tablet: 'row',
  },
  gap: '0.5rem',
}

const ProfilePage = () => {
  const userIsAdmin = useAppSelector(selectIsCurrentUserAdmin)
  const currentUser = useAppSelector(selectCurrentUserProfile)
  const isLoading = useAppSelector(selectIsLoading)
  const user = useAppSelector(selectUser)

  const modalAction = useAppSelector(selectModalAction)
  const isCreateEditModalOpen = useAppSelector(selectIsCreateEditModalOpen)
  const isDeleteModalOpen = useAppSelector(selectIsDeleteModalOpen)

  const error = useAppSelector(selectUserHasError)
  const isDeleted = useAppSelector(selectUsersIsDeleted)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { id } = useParams()

  const userIsCurrentUser = id == currentUser?.id
  const isAccountEditable =
    user?.account.status !== Status.ARCHIVED && (userIsAdmin || userIsCurrentUser)

  useEffect(() => {
    id && dispatch(getUserById(id))
  }, [id])

  const handleEditClick = () => {
    dispatch(openModal({ action: UserModalActions.EDIT, user }))
  }

  const handleDeleteClick = () => {
    dispatch(openModal({ action: UserModalActions.DELETE, user }))
  }

  const handleDeleteUser = () => {
    id && dispatch(deleteUser({ userId: Number(id) }))
  }

  const getUsersAfterProfileDeletion = () => {
    navigate(RoutePaths.USERS)
  }

  const getUserProfileAfterUpdate = () => {
    id && dispatch(getUserById(id))
  }

  useEffect(() => {
    if (isDeleted) {
      getUsersAfterProfileDeletion()
      dispatch(setAlert({ message: AlertSuccessMessages.USERS_DELETE, type: AlertType.SUCCESS }))
      dispatch(clearIsDeleted())
      closeModal()
    } else if (error) {
      const errorMessage = typeof error === 'string' ? error : AlertErrorMessages.USERS_DELETE
      dispatch(setAlert({ message: errorMessage, type: AlertType.ERROR }))
      dispatch(clearUserError())
    }
  }, [isDeleted, error])

  const closeModal = () => {
    dispatch(clearModal())
  }

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
            {user && <UserAvatar user={user} />}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: '15px',
              }}
            >
              <Typography variant='subtitle1' sx={{ fontWeight: '600' }}>
                {user?.fullName}
              </Typography>
              <Typography variant='subtitle2' sx={{ color: 'grey.500' }}>
                {user?.account.role && setCapitalizedWord(user.account.role)}
              </Typography>{' '}
            </Box>
          </Box>
          <Divider sx={{ borderTop: '2px solid grey.400' }} />
          <List>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Email:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2'>
                    {user?.account.email && (
                      <Tooltip title={`Send email to ${user?.fullName}`}>
                        <Link
                          href={`mailto:${user.account.email}`}
                          sx={{
                            '&:hover': {
                              color: 'primary.main',
                            },
                            borderBottom: '1px solid currentColor',
                            color: 'grey.500',
                            textDecoration: 'none',
                            transition: '0.3s all',
                          }}
                        >
                          {user.account.email}
                        </Link>
                      </Tooltip>
                    )}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Date of birth:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2' sx={{ color: 'grey.500' }}>
                    {user?.dateOfBirth}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Location:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2' sx={{ color: 'grey.500' }}>
                    {user?.location}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Phone number:</Typography>
              <ListItemText
                primary={
                  <Typography variant='body2'>
                    {user?.phoneNumber && (
                      <Tooltip title={`Call ${user?.fullName}`}>
                        <Link
                          href={`tel:${user?.phoneNumber}`}
                          sx={{
                            '&:hover': {
                              color: 'primary.main',
                            },
                            borderBottom: '1px solid currentColor',
                            color: 'grey.500',
                            textDecoration: 'none',
                            transition: '0.3s all',
                          }}
                        >
                          {user?.phoneNumber}
                        </Link>
                      </Tooltip>
                    )}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <Typography variant='body1'>Technologies:</Typography>{' '}
              <ListItemText
                primary={
                  user?.technologies !== undefined && user?.technologies?.length > 0 ? (
                    <List sx={{ display: 'flex', flexWrap: 'wrap', padding: '0' }}>
                      {user?.technologies.map((technology: Technology, index, arr) => (
                        <Typography
                          key={technology.id}
                          variant='body2'
                          sx={{
                            color: 'grey.500',
                            marginRight: index !== arr.length - 1 ? '8px' : 0,
                          }}
                        >
                          {technology.name}
                          {index !== arr.length - 1 && ','}
                        </Typography>
                      ))}
                    </List>
                  ) : (
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'grey.500',
                      }}
                    >
                      {' '}
                      No technologies
                    </Typography>
                  )
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
            {userIsAdmin && (
              <Tooltip title={`Delete ${user?.fullName}`}>
                <IconButton aria-label='delete' onClick={handleDeleteClick}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
            {isAccountEditable && (
              <Tooltip
                title={userIsCurrentUser ? 'Update your profile' : `Update ${user?.fullName}`}
              >
                <IconButton aria-label='update' onClick={handleEditClick}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </LoadingWrapper>

      {isCreateEditModalOpen && (
        <UserModalForm
          onClose={closeModal}
          action={modalAction!}
          onUpdate={getUserProfileAfterUpdate}
          info={modalAction === UserModalActions.EDIT ? user : null}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmationModal
          open={isDeleteModalOpen}
          onClose={closeModal}
          title='Proceed to delete?'
          content='Are you sure you want to delete this user?'
          confirmButtonText='Delete'
          isLoading={isLoading}
          onConfirm={handleDeleteUser}
        />
      )}
    </>
  )
}

export default ProfilePage
