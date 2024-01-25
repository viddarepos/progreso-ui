import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { api } from '../../utils/axios.config'
import { SeasonsSliceActionTypePrefix } from '../../utils/enums'
import type { Season, SeasonPagination } from '../../utils/interfaces'
import { type ResponseWithPagebleContent, type SeasonsInitialState } from '../slice.types'

const { SEASONS_DELETE, SEASONS_GET_ALL, SEASONS_GET_ONE } = SeasonsSliceActionTypePrefix

const initialState: SeasonsInitialState = {
  error: null,
  id: null,
  isDeleted: false,
  isLoading: false,
  openDeleteModal: false,
  pageNumber: 0,
  pageSize: 10,
  season: null,
  seasons: [],
  totalPages: 1,
}

export const getAllSeasons = createAsyncThunk<
  ResponseWithPagebleContent<Season>,
  SeasonPagination | void
>(SEASONS_GET_ALL, async (criteria?) => {
  const response = await api.get('/seasons', {
    params: criteria,
  })

  return response?.data
})

export const deleteSeason = createAsyncThunk(
  SEASONS_DELETE,
  async ({ seasonId }: { seasonId: number }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`seasons/${seasonId}`)
      return response?.data
    } catch (error: any) {
      if (error?.response) {
        return rejectWithValue(error.response.data.detail)
      }
      throw new Error(error)
    }
  }
)

export const getSeasonById = createAsyncThunk(
  SEASONS_GET_ONE,
  async (seasonId: number | string) => {
    const response = await api.get(`seasons/${seasonId}`)
    return response?.data
  }
)

const seasonsSlice = createSlice({
  extraReducers: (builder) => {
    return builder
      .addCase(getAllSeasons.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllSeasons.fulfilled, (state, action) => {
        state.pageSize = action.payload.size
        state.totalPages = action.payload.totalPages
        state.isLoading = false
        state.seasons = action.payload.content

        if (state.seasons.length === 0 && state.totalPages) {
          state.pageNumber = state.totalPages - 1
        } else {
          state.pageNumber = action.payload.number
        }
      })
      .addCase(getAllSeasons.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getSeasonById.pending, (state) => {
        state.isLoading = true
        state.season = null
        state.error = null
      })
      .addCase(getSeasonById.fulfilled, (state, action) => {
        state.isLoading = false
        state.season = action.payload
      })
      .addCase(getSeasonById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? action.error
      })
      .addCase(deleteSeason.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteSeason.fulfilled, (state) => {
        state.isLoading = false
        state.isDeleted = true
      })
      .addCase(deleteSeason.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? action.error
      })
  },
  initialState,
  name: 'seasons',
  reducers: {
    changePage: (state, action) => {
      state.pageNumber = action.payload
    },
    changePageSize: (state, action) => {
      state.pageSize = action.payload
    },
    changeToFirstPage: (state) => {
      state.pageNumber = 0
    },
    clearId: (state) => {
      state.id = null
    },
    clearIsDeleted: (state) => {
      state.isDeleted = false
    },
    clearSeasonsError: (state) => {
      state.error = null
    },
    setId: (state, action) => {
      state.id = action.payload
    },
    toggleModal: (state) => {
      state.openDeleteModal = !state.openDeleteModal
    },
  },
})

const seasonsReducer = seasonsSlice.reducer
export const {
  clearSeasonsError,
  clearIsDeleted,
  toggleModal,
  setId,
  clearId,
  changePageSize,
  changeToFirstPage,
  changePage,
} = seasonsSlice.actions
export default seasonsReducer
