import type { RootState } from '../../app/store'

const usersSelector = (state: RootState) => state.users

export const selectUsers = (state: RootState) => usersSelector(state).users

export const selectUser = (state: RootState) => usersSelector(state).user

export const selectUsersIsLoading = (state: RootState) => usersSelector(state).isLoading

export const selectIsLoading = (state: RootState) => usersSelector(state).isLoadingUser

export const selectUsersIsSuccess = (state: RootState) => usersSelector(state).isSuccess

export const selectUsersIsPasswordChanged = (state: RootState) =>
  usersSelector(state).isPasswordChanged

export const selectUsersError = (state: RootState) => usersSelector(state).error

export const selectUserHasError = (state: RootState) => usersSelector(state).userError

export const selectUsersIsDeleted = (state: RootState) => usersSelector(state).isDeleted

export const selectUsersIsArchived = (state: RootState) => usersSelector(state).isArchived

export const selectUserActionErrors = (state: RootState) => usersSelector(state).actionErrors

export const selectUsersTablePageSize = (state: RootState) => usersSelector(state).pageSize

export const selectUsersTablePageNumber = (state: RootState) => usersSelector(state).pageNumber

export const selectUsersTableTotalPages = (state: RootState) => usersSelector(state).totalPages
