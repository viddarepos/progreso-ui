import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import uniqBy from 'lodash/uniqBy'

import { api } from '../../utils/axios.config'
import { RequestersSliceActionTypePrefix } from '../../utils/enums'
import type { Requester, User } from '../../utils/interfaces'
import type { RequestersInitialState } from '../slice.types'

const { REQUESTERS_GET_ALL } = RequestersSliceActionTypePrefix

const initialState: RequestersInitialState = {
  error: null,
  isLoading: false,
  requesters: [] as Requester[],
}

export const getRequesters = createAsyncThunk<User[], number[]>(
  REQUESTERS_GET_ALL,
  async (userIds) => {
    const responseArray = await Promise.all(userIds.map((userId) => api.get(`users/${userId}`)))
    return responseArray.map((response) => response.data)
  }
)

const requestersSlice = createSlice({
  extraReducers: (builder) => {
    return builder
      .addCase(getRequesters.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRequesters.fulfilled, (state, action) => {
        state.isLoading = false
        const eventRequesters: Requester[] = action.payload.map((user) => ({
          id: user.id,
          requestor: user,
        }))
        state.requesters = uniqBy([...state.requesters, ...eventRequesters], 'id')
      })
      .addCase(getRequesters.rejected, (state, action) => {
        state.isLoading = false
        state.requesters = []
        state.error = {
          ...action.error,
          type: REQUESTERS_GET_ALL,
        }
      })
  },
  initialState,
  name: 'requesters',
  reducers: {},
})

const requestersReducer = requestersSlice.reducer

export default requestersReducer
