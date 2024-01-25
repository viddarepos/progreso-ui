import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AxiosResponse } from 'axios'

import { api } from '../../utils/axios.config'
import { STORAGE_ACCESS_TOKEN_KEY } from '../../utils/constants'
import type { GatewayApiError } from '../../utils/interfaces'
import type { AuthInitialState } from '../slice.types'

const initialState: AuthInitialState = {
  error: null,
  isLoading: false,
  isLoggedIn: Boolean(localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)),
}

export const loginRequest = createAsyncThunk<
  AxiosResponse,
  { email: string; password: string },
  { rejectValue: GatewayApiError }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post('/authenticate', { email, password })
    return response?.data.jwtToken
  } catch (error: any) {
    if (error?.response) {
      return rejectWithValue(error.response.data.violations)
    }
    throw new Error(error)
  }
})

const authSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(loginRequest.pending, (state) => {
        state.isLoading = true
        state.isLoggedIn = false
        state.error = null
      })
      .addCase(loginRequest.fulfilled, (state) => {
        state.isLoading = false
        state.isLoggedIn = true
      })
      .addCase(loginRequest.rejected, (state, action) => {
        state.isLoggedIn = false
        state.error = action.payload ?? action.error
      })
  },
  initialState,
  name: 'auth',
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false
    },
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
