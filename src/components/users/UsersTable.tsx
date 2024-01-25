import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import { useEffect, useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '../../app/store'
import { setAlert } from '../../features/alerts/alertsSlice'
import {
  selectIsArchiveConfirmationModalOpen,
  selectIsCreateEditModalOpen,
  selectIsDeleteModalOpen,
  selectModalAction,
  selectedUser,
} from '../../features/modals/userActionsModalSelectors'
import { clearModal, openModal } from '../../features/modals/userActionsModalSlice'
import { selectIsCurrentUserAdmin } from '../../features/profile/profileSelectors'
import {
  selectIsLoading,
  selectUserHasError,
  selectUsers,
  selectUsersIsArchived,
  selectUsersIsDeleted,
  selectUsersTablePageNumber,
  selectUsersTablePageSize,
  selectUsersTableTotalPages,
} from '../../features/users/usersSelectors'
import {
  archiveUser,
  changePage,
  changePageSize,
  changeToFirstPage,
  clearIsArchived,
  clearIsDeleted,
  clearUserError,
  deleteUser,
  getAllUsers,
} from '../../features/users/usersSlice'
import useThemeBreakpoints from '../../hooks/useThemeBreakpoints'
import {
  AlertErrorMessages,
  AlertSuccessMessages,
  AlertType,
  Role,
  UserModalActions,
} from '../../utils/enums'
import type { FilterUser, FilterUserData } from '../../utils/interfaces'
import LoadingWrapper from '../../wrappers/LoadingWrapper'
import ConfirmationModal from '../shared/ConfirmationModal'
import Pagination from '../shared/Pagination'

import UserModalForm from './components/CreateAndEditModal'
import UsersItem from './UsersItem'

const tableCellStyle = {
  color: 'common.white',
  padding: {
    desktop: '16px',
    laptop: '12px',
    mobile: '8px',
    tablet: '14px',
  },
}

export default function UsersTable() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      filterLocation: '',
      filterName: '',
      filterRole: '',
    },
  })
  const { desktopBreakpoint, tabletBreakpoint, laptopBreakpoint } = useThemeBreakpoints()
  const dispatch = useAppDispatch()

  const isLoading = useAppSelector(selectIsLoading)
  const userIsAdmin = useAppSelector(selectIsCurrentUserAdmin)
  const allUsers = useAppSelector(selectUsers)

  const isCreateEditModalOpen = useAppSelector(selectIsCreateEditModalOpen)
  const isDeleteModalOpen = useAppSelector(selectIsDeleteModalOpen)
  const isArchiveConfirmationModalOpen = useAppSelector(selectIsArchiveConfirmationModalOpen)
  const modalAction = useAppSelector(selectModalAction)
  const user = useAppSelector(selectedUser)

  const [filterCriteria, setFilterCriteria] = useState<FilterUser>({})
  const pageNumber = useAppSelector(selectUsersTablePageNumber)
  const pageSize = useAppSelector(selectUsersTablePageSize)
  const totalPages = useAppSelector(selectUsersTableTotalPages)
  const error = useAppSelector(selectUserHasError)
  const isDeleted = useAppSelector(selectUsersIsDeleted)
  const isArchived = useAppSelector(selectUsersIsArchived)
  const colSpan: number = desktopBreakpoint ? 7 : laptopBreakpoint ? 6 : tabletBreakpoint ? 5 : 3

  useEffect(() => {
    return () => {
      dispatch(changeToFirstPage())
    }
  }, [])

  const fetchUsersData = (criteria: FilterUser) => {
    dispatch(getAllUsers(criteria))
  }

  const handleChangePage = (page: number) => {
    dispatch(changePage(page))
  }

  useEffect(() => {
    const criteria: FilterUser = {
      ...filterCriteria,
      page: pageNumber,
      size: pageSize,
    }
    fetchUsersData(criteria)
  }, [pageNumber, pageSize, filterCriteria])

  useEffect(() => {
    if (isDeleted) {
      getUsersAfterUpdate()
      dispatch(setAlert({ message: AlertSuccessMessages.USERS_DELETE, type: AlertType.SUCCESS }))
      dispatch(clearIsDeleted())
      closeModal()
    }
  }, [isDeleted])

  useEffect(() => {
    if (isArchived) {
      getUsersAfterUpdate()
      dispatch(setAlert({ message: AlertSuccessMessages.USERS_ARCHIVE, type: AlertType.SUCCESS }))
      dispatch(clearIsArchived())
      closeModal()
    }
  }, [isArchived])

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : modalAction === UserModalActions.ARCHIVE
          ? AlertErrorMessages.USERS_ARCHIVE
          : AlertErrorMessages.USERS_DELETE
      dispatch(setAlert({ message: errorMessage, type: AlertType.ERROR }))
      dispatch(clearUserError())
    }
  }, [error])

  const handleCreateClick = () => {
    dispatch(openModal({ action: UserModalActions.CREATE }))
  }

  const handleResultsPerPageChange = (event: SelectChangeEvent) => {
    const resultsPerPageString = event.target.value
    dispatch(changePageSize(resultsPerPageString))
    dispatch(changeToFirstPage())
  }

  const onSubmit: SubmitHandler<FilterUserData> = async (data) => {
    const filters: FilterUser = {
      fullName: data.filterName,
      location: data.filterLocation,
      role: data.filterRole,
    }

    const newFilterCriteria = omitBy(filters, (param) => !param)

    if (!isEmpty(newFilterCriteria)) {
      setFilterCriteria(newFilterCriteria)
      dispatch(changeToFirstPage())
    }
  }

  const getUsersAfterUpdate = () => {
    const criteria = {
      ...filterCriteria,
      page: pageNumber,
      size: pageSize,
    }

    fetchUsersData(criteria)
  }

  const handleDeleteUser = () => {
    user?.id && dispatch(deleteUser({ userId: user.id }))
  }

  const handleArchiveUser = () => {
    user?.id && dispatch(archiveUser(user.id))
  }

  const clearFilters = () => {
    setFilterCriteria({})
    dispatch(changeToFirstPage())
  }

  const closeModal = () => {
    dispatch(clearModal())
  }

  const handleReset = () => {
    clearFilters()
    reset()
  }

  return (
    <Box
      sx={{
        marginInline: 'auto',
        width: {
          desktop: '90vw',
          laptop: '90vw',
          largeScreen: '80vw',
          mobile: '90vw',
          tablet: '90vw',
        },
      }}
    >
      <Box>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              sx={{
                alignItems: 'center',
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: {
                  desktop: 'repeat(3,1fr), 1fr',
                  tablet: 'repeat(3,1fr)',
                },
                justifyContent: 'center',
                marginBlock: '2rem',
              }}
            >
              <FormControl
                sx={{
                  '& .MuiInputBase-root': {
                    width: '100%',
                  },
                }}
              >
                <InputLabel
                  sx={{
                    marginLeft: '-0.75rem',
                    marginTop: '-2rem',
                  }}
                  htmlFor='filterName'
                >
                  Name
                </InputLabel>
                <Controller
                  name='filterName'
                  control={control}
                  render={({ field }) => <TextField {...field} placeholder='Name' />}
                />
              </FormControl>

              <FormControl
                sx={{
                  '& .MuiInputBase-root': {
                    width: '100%',
                  },
                }}
              >
                <InputLabel
                  sx={{
                    fontSize: '1.1rem',
                    marginLeft: '-0.75rem',
                    marginTop: '-0.5rem',
                  }}
                  htmlFor='filterRole'
                  shrink
                >
                  Role
                </InputLabel>
                <Controller
                  name='filterRole'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={(event) => field.onChange(event.target.value)}
                      sx={{
                        height: 'auto',
                        lineHeight: '1rem',
                      }}
                    >
                      <MenuItem value={Role.INTERN}>Intern</MenuItem>
                      <MenuItem value={Role.MENTOR}>Mentor</MenuItem>
                      <MenuItem value={Role.ADMIN}>Admin</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl
                sx={{
                  '& .MuiInputBase-root': {
                    width: '100%',
                  },
                }}
              >
                <InputLabel
                  sx={{
                    marginLeft: '-0.75rem',
                    marginTop: '-2rem',
                  }}
                  htmlFor='filterLocation'
                >
                  Location
                </InputLabel>
                <Controller
                  name='filterLocation'
                  control={control}
                  render={({ field }) => <TextField {...field} placeholder='Location' />}
                />
              </FormControl>

              <Box
                sx={{
                  display: 'flex',
                  gap: '1rem',
                  gridColumn: {
                    desktop: '-1',
                    laptop: '-1',
                    mobile: '1/-1',
                    tablet: '1/-1',
                  },
                  justifySelf: 'center',
                }}
              >
                <Button type='submit' variant='primary'>
                  Search
                </Button>
                <Button onClick={handleReset} variant='outlined'>
                  Reset
                </Button>
              </Box>
            </FormControl>
          </form>
        </Box>

        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: {
              desktop: 'row',
              laptop: 'row',
              mobile: 'column',
              tablet: 'row',
            },
            gap: '1rem',
            justifyContent: 'space-between',
            margin: '0 auto',
          }}
        >
          {userIsAdmin ? (
            <Button variant='outlined' onClick={handleCreateClick}>
              Create user
            </Button>
          ) : (
            <Box />
          )}
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
            }}
          >
            <Typography sx={{ color: 'grey.500' }}>Results per page</Typography>
            <FormControl>
              <Select
                sx={{ width: '6rem' }}
                value={String(pageSize)}
                onChange={handleResultsPerPageChange}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TableContainer
          sx={{
            margin: '2rem auto',
          }}
          component={Paper}
        >
          <Table aria-label='simple table' sx={{ fontSize: '0.8rem' }}>
            <TableHead sx={{ backgroundColor: 'grey.500' }}>
              <TableRow>
                <TableCell sx={tableCellStyle}>Profile</TableCell>
                <TableCell sx={tableCellStyle} align='left'>
                  Name
                </TableCell>
                {tabletBreakpoint && (
                  <>
                    <TableCell sx={tableCellStyle} align='left'>
                      Role
                    </TableCell>
                    <TableCell sx={tableCellStyle} align='left'>
                      Location
                    </TableCell>
                    {desktopBreakpoint && (
                      <TableCell sx={tableCellStyle} align='left'>
                        Phone number
                      </TableCell>
                    )}
                    {laptopBreakpoint && (
                      <TableCell sx={{ color: 'common.white' }} align='left'>
                        Email
                      </TableCell>
                    )}
                  </>
                )}

                <TableCell sx={tableCellStyle} align='left'>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ minHeight: '40px', position: 'relative' }}>
              <LoadingWrapper isLoading={isLoading} tableColSpan={colSpan}>
                {allUsers.length === 0 ? (
                  <TableRow>
                    <TableCell align='center' colSpan={colSpan} sx={{ padding: '3rem 0' }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  allUsers.map((user) => <UsersItem key={user.id} user={user} />)
                )}
              </LoadingWrapper>
            </TableBody>
          </Table>
          <Pagination
            totalPages={totalPages}
            pageNumber={pageNumber}
            setPageNumber={handleChangePage}
          />
        </TableContainer>
      </Box>

      {isCreateEditModalOpen && (
        <UserModalForm
          onClose={closeModal}
          action={modalAction!}
          onUpdate={getUsersAfterUpdate}
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

      <ConfirmationModal
        open={isArchiveConfirmationModalOpen}
        onClose={closeModal}
        title='Archive user?'
        content={`Are you sure you want to archive this user? \n This action will prevent the user from logging in \n and using the app.`}
        confirmButtonText='Archive'
        isLoading={isLoading}
        onConfirm={handleArchiveUser}
      />
    </Box>
  )
}
