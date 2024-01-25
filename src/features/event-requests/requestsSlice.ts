import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { api } from '../../utils/axios.config'
import { RequestsSliceActionTypePrefix } from '../../utils/enums'
import type { EventRequest, EventRequestData } from '../../utils/interfaces'
import type {
  Pagination,
  RequestChangeStatusData,
  RequestsFilterCriteria,
  RequestsInitialState,
  ResponseWithPagebleContent,
} from '../slice.types'

const {
  REQUESTS_GET_ALL,
  REQUESTS_CREATE,
  REQUESTS_CHANGE_STATUS,
  REQUESTS_EDIT,
  REQUESTS_GET_ONE,
} = RequestsSliceActionTypePrefix

const initialPagination: Pagination = {
  pageNumber: 0,
  totalPages: 0,
}

const initialState: RequestsInitialState = {
  error: null,
  loadingType: null,
  pagination: initialPagination,
  request: null,
  requests: null,
  successType: null,
}

export const getAllRequests = createAsyncThunk<
  ResponseWithPagebleContent<EventRequest>,
  RequestsFilterCriteria | void
>(REQUESTS_GET_ALL, async (filters?) => {
  const response = await api.get('events/request', {
    params: { ...filters, sort: 'status' },
  })
  return response.data
})

export const getRequestById = createAsyncThunk<EventRequest, number>(
  REQUESTS_GET_ONE,
  async (id) => {
    const response = await api.get(`events/request/${id}`)
    return response.data
  }
)

export const createEventRequest = createAsyncThunk<EventRequest, EventRequestData>(
  REQUESTS_CREATE,
  async (data) => {
    const response = await api.post('events/request', data)
    return response.data
  }
)

export const editEventRequest = createAsyncThunk<EventRequest, EventRequestData>(
  REQUESTS_EDIT,
  async ({ id, ...data }) => {
    const response = await api.patch(`events/request/${id}`, data)
    return response.data
  }
)

export const changeRequestStatus = createAsyncThunk<EventRequest, RequestChangeStatusData>(
  REQUESTS_CHANGE_STATUS,
  async ({ id, ...data }) => {
    const result = await api.post(`events/request/${id}/status`, data)
    return result.data
  }
)

const requestsSlice = createSlice({
  extraReducers: (builder) => {
    return builder
      .addCase(createEventRequest.pending, (state) => {
        state.loadingType = REQUESTS_CREATE
        state.successType = null
        state.error = null
      })
      .addCase(createEventRequest.fulfilled, (state) => {
        state.loadingType = null
        state.successType = REQUESTS_CREATE
      })
      .addCase(createEventRequest.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: REQUESTS_CREATE,
        }
      })
      .addCase(getAllRequests.pending, (state) => {
        state.loadingType = REQUESTS_GET_ALL
        state.requests = null
        state.error = null
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.loadingType = null
        state.requests = action.payload.content
        state.pagination.pageNumber = action.payload.number
        state.pagination.totalPages = action.payload.totalPages
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.loadingType = null
        state.pagination = initialPagination
        state.error = {
          ...action.error,
          type: REQUESTS_GET_ALL,
        }
      })
      .addCase(getRequestById.pending, (state) => {
        state.loadingType = REQUESTS_GET_ONE
        state.request = null
        state.error = null
      })
      .addCase(getRequestById.fulfilled, (state, action) => {
        state.loadingType = null
        state.request = action.payload
      })
      .addCase(getRequestById.rejected, (state, action) => {
        state.loadingType = null
        state.request = null
        state.error = {
          ...action.error,
          type: REQUESTS_GET_ONE,
        }
      })
      .addCase(changeRequestStatus.pending, (state) => {
        state.loadingType = REQUESTS_CHANGE_STATUS
        state.error = null
      })
      .addCase(changeRequestStatus.fulfilled, (state) => {
        state.loadingType = null
        state.successType = REQUESTS_CHANGE_STATUS
      })
      .addCase(changeRequestStatus.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: REQUESTS_CHANGE_STATUS,
        }
      })
      .addCase(editEventRequest.pending, (state) => {
        state.loadingType = REQUESTS_EDIT
        state.successType = null
        state.error = null
      })
      .addCase(editEventRequest.fulfilled, (state) => {
        state.loadingType = null
        state.successType = REQUESTS_EDIT
      })
      .addCase(editEventRequest.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: REQUESTS_EDIT,
        }
      })
  },
  initialState,
  name: 'requests',
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
  },
})

const requestsReducer = requestsSlice.reducer
export const { clearSuccessType, changePageNumber, clearPagination, clearError } =
  requestsSlice.actions
export default requestsReducer
