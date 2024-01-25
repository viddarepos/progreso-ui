import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { LOCATION_API_URL } from '../../utils/constants'
import { LocationType } from '../../utils/enums'
import type { CountryData } from '../../utils/interfaces'
import type { LocationInitialState } from '../slice.types'

const { COUNTRIES } = LocationType

const initialState: LocationInitialState = {
  error: null,
  isLoading: false,
  isSuccess: false,
  locations: null,
}

export const getCountries = createAsyncThunk<CountryData[]>(COUNTRIES, async () => {
  const response = await axios.get(LOCATION_API_URL)
  return response?.data.data
})

const locationSlice = createSlice({
  extraReducers: (builder) => {
    return builder
      .addCase(getCountries.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCountries.fulfilled, (state, action) => {
        state.isLoading = false
        state.locations = action.payload
      })
      .addCase(getCountries.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || null
      })
  },
  initialState,
  name: 'location',
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearLocations: (state) => {
      state.locations = null
    },
  },
})

export const { clearError } = locationSlice.actions
export default locationSlice.reducer
