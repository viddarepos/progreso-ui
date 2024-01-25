import type { RootState } from '../../app/store'
import { UserModalActions } from '../../utils/enums'

const userActionsModalSelector = (state: RootState) => state.userActionsModal

export const selectModalAction = (state: RootState) => userActionsModalSelector(state).action

export const selectIsCreateEditModalOpen = (state: RootState) =>
  userActionsModalSelector(state).action === UserModalActions.CREATE ||
  userActionsModalSelector(state).action === UserModalActions.EDIT

export const selectIsDeleteModalOpen = (state: RootState) =>
  userActionsModalSelector(state).action === UserModalActions.DELETE

export const selectIsArchiveConfirmationModalOpen = (state: RootState) =>
  userActionsModalSelector(state).action === UserModalActions.ARCHIVE

export const selectedUser = (state: RootState) => userActionsModalSelector(state).user
