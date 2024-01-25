import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { api } from '../../utils/axios.config'
import { TechnologiesSliceActionTypePrefix } from '../../utils/enums'
import type { GatewayApiError, Technology } from '../../utils/interfaces'
import type {
  FilterCriteria,
  Pagination,
  ResponseWithPagebleContent,
  TechnologiesInitialState,
} from '../slice.types'

const initialPagination: Pagination = {
  pageNumber: 0,
  totalPages: 0,
}

const initialState: TechnologiesInitialState = {
  error: null,
  loadingType: null,
  pagination: initialPagination,
  successType: null,
  technologies: null,
  technologiesByPage: null,
  technology: null,
}

const {
  TECHNOLOGIES_GET_ALL,
  TECHNOLOGIES_CREATE,
  TECHNOLOGIES_DELETE,
  TECHNOLOGIES_EDIT,
  TECHNOLOGIES_GET_ONE,
  TECHNOLOGIES_GET_ONE_PAGE,
} = TechnologiesSliceActionTypePrefix

export const getAllTechnologies = createAsyncThunk<ResponseWithPagebleContent<Technology>, void>(
  TECHNOLOGIES_GET_ALL,
  async () => {
    const response = await api.get('technologies')
    return response?.data
  }
)

export const getTechnologiesByPage = createAsyncThunk<
  ResponseWithPagebleContent<Technology>,
  FilterCriteria | void
>(TECHNOLOGIES_GET_ONE_PAGE, async (filters?) => {
  const response = await api.get('technologies', { params: { ...filters, size: 10 } })
  return response?.data
})

export const getOneTechnology = createAsyncThunk<Technology, number>(
  TECHNOLOGIES_GET_ONE,
  async (id) => {
    const response = await api.get(`technologies/${id}`)
    return response?.data
  }
)

export const createTechnology = createAsyncThunk<
  Technology,
  { name: string },
  { rejectValue: GatewayApiError }
>(TECHNOLOGIES_CREATE, async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('technologies', data)
    return response?.data
  } catch (error: any) {
    if (error?.response) {
      return rejectWithValue({
        ...error.response.data.violations[0],
        status: error.response.status,
      })
    }
    throw new Error(error)
  }
})

export const editTechnology = createAsyncThunk<
  Technology,
  { id: number; name: string },
  { rejectValue: GatewayApiError }
>(TECHNOLOGIES_EDIT, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`technologies/${id}`, data)
    return response?.data
  } catch (error: any) {
    if (error?.response) {
      return rejectWithValue(error.response.data)
    }
    throw new Error(error)
  }
})

export const deleteTechnology = createAsyncThunk<void, number>(TECHNOLOGIES_DELETE, async (id) => {
  const response = await api.delete(`technologies/${id}`)
  return response?.data
})

const technologiesSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(getAllTechnologies.pending, (state) => {
        state.loadingType = TECHNOLOGIES_GET_ALL
        state.error = null
        state.technologies = null
      })
      .addCase(getAllTechnologies.fulfilled, (state, action) => {
        state.loadingType = null
        state.technologies = action.payload.content
      })
      .addCase(getAllTechnologies.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: TECHNOLOGIES_GET_ALL,
        }
      })
      .addCase(getTechnologiesByPage.pending, (state) => {
        state.loadingType = TECHNOLOGIES_GET_ONE_PAGE
        state.error = null
      })
      .addCase(getTechnologiesByPage.fulfilled, (state, action) => {
        state.loadingType = null
        state.technologiesByPage = action.payload.content
        state.pagination.pageNumber = action.payload.number
        state.pagination.totalPages = action.payload.totalPages
      })
      .addCase(getTechnologiesByPage.rejected, (state, action) => {
        state.loadingType = null
        state.technologiesByPage = null
        state.error = {
          ...action.error,
          type: TECHNOLOGIES_GET_ONE_PAGE,
        }
      })
      .addCase(getOneTechnology.pending, (state) => {
        state.loadingType = TECHNOLOGIES_GET_ONE
        state.error = null
        state.technology = null
      })
      .addCase(getOneTechnology.fulfilled, (state, action) => {
        state.loadingType = null
        state.technology = action.payload
      })
      .addCase(getOneTechnology.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: TECHNOLOGIES_GET_ONE,
        }
      })
      .addCase(createTechnology.pending, (state) => {
        state.loadingType = TECHNOLOGIES_CREATE
        state.error = null
        state.successType = null
      })
      .addCase(createTechnology.fulfilled, (state) => {
        state.loadingType = null
        state.successType = TECHNOLOGIES_CREATE
      })
      .addCase(createTechnology.rejected, (state, action) => {
        state.loadingType = null
        state.error = action.payload
          ? {
              ...action.payload,
              type: TECHNOLOGIES_CREATE,
            }
          : {
              ...action.error,
              type: TECHNOLOGIES_CREATE,
            }
      })
      .addCase(editTechnology.pending, (state) => {
        state.loadingType = TECHNOLOGIES_EDIT
        state.error = null
        state.successType = null
      })
      .addCase(editTechnology.fulfilled, (state) => {
        state.loadingType = null
        state.successType = TECHNOLOGIES_EDIT
      })
      .addCase(editTechnology.rejected, (state, action) => {
        state.loadingType = null
        state.error = action.payload
          ? {
              ...action.payload,
              type: TECHNOLOGIES_EDIT,
            }
          : {
              ...action.error,
              type: TECHNOLOGIES_EDIT,
            }
      })
      .addCase(deleteTechnology.pending, (state) => {
        state.loadingType = TECHNOLOGIES_DELETE
        state.error = null
        state.successType = null
      })
      .addCase(deleteTechnology.fulfilled, (state) => {
        state.loadingType = null
        state.successType = TECHNOLOGIES_DELETE
      })
      .addCase(deleteTechnology.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: TECHNOLOGIES_DELETE,
        }
      })
  },
  initialState,
  name: 'technologiesState',
  reducers: {
    changePageNumber: (state, action: { payload: number }) => {
      state.pagination.pageNumber = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearPagination: (state) => {
      state.pagination = initialPagination
    },
    clearSuccessType: (state) => {
      state.successType = null
    },
    clearTechnology: (state) => {
      state.technology = null
    },
  },
})

const technologiesReducer = technologiesSlice.reducer
export const { clearError, clearSuccessType, changePageNumber, clearPagination, clearTechnology } =
  technologiesSlice.actions
export default technologiesReducer
