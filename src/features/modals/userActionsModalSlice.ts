import { createSlice } from '@reduxjs/toolkit'

import type { UserModalActions } from '../../utils/enums'
import type { User } from '../../utils/interfaces'
import type { UserActionsModalData } from '../slice.types'

const initialState: UserActionsModalData = {
  action: null,
  user: null,
}

const userActionsModalSlice = createSlice({
  initialState,
  name: 'userActionsModal',
  reducers: {
    clearModal: (state) => {
      state.action = null
      state.user = null
    },
    openModal: (state, action: { payload: { action: UserModalActions; user?: User | null } }) => {
      state.action = action.payload.action
      state.user = action.payload.user
    },
  },
})

export const { clearModal, openModal } = userActionsModalSlice.actions
export default userActionsModalSlice.reducer
