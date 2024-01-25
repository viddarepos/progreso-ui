import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { api } from '../../utils/axios.config'
import { Role } from '../../utils/enums'
import type { ProfileInitialState } from '../slice.types'

const initialState: ProfileInitialState = {
  currentUser: null,
  error: null,
  imageData: [],
  imageError: null,
  isLoading: false,
  isSuccess: false,
  isUserAdmin: false,
}

export const getCurrentUser = createAsyncThunk('users/getUserById', async (id: number) => {
  const response = await api.get(`/users/${id}`)
  return response?.data
})

export const getProfilePicture = createAsyncThunk<
  { url: string; userId: number },
  { id: number; imagePath: string }
>('users/profilePicture', async ({ id, imagePath }) => {
  const response = await api.get(imagePath, {
    responseType: 'blob',
  })
  return { url: URL.createObjectURL(response.data), userId: id }
})

const profileSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.error = null
        state.isUserAdmin = false
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentUser = action.payload
        state.isUserAdmin = action.payload.account.role === Role.ADMIN
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.currentUser = null
        state.error = action.error
      })
      .addCase(getProfilePicture.pending, (state) => {
        state.imageError = null
      })
      .addCase(getProfilePicture.fulfilled, (state, action) => {
        state.imageData = [...state.imageData, action.payload]
      })
      .addCase(getProfilePicture.rejected, (state, action) => {
        state.imageData = []
        state.imageError = action.error
      })
  },
  initialState,
  name: 'profile',
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null
      state.isUserAdmin = false
    },
  },
})

export const { clearCurrentUser } = profileSlice.actions
export default profileSlice.reducer
