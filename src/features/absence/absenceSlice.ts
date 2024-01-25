import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { api } from '../../utils/axios.config'
import { AbsenceSliceActionTypePrefix } from '../../utils/enums'
import type {
  Absence,
  AbsenceData,
  CalendarAbsence,
  CalendarFilterData,
} from '../../utils/interfaces'
import type {
  AbsenceInitialState,
  AbsencesFilterCriteria,
  Pagination,
  ResponseWithPagebleContent,
} from '../slice.types'

const {
  ABSENCE_GET_ALL,
  ABSENCE_CREATE,
  ABSENCE_UPDATE,
  ABSENCE_GET_ONE,
  ABSENCE_DELETE,
  ABSENCE_GET_CALENDAR,
} = AbsenceSliceActionTypePrefix

const initialPagination: Pagination = {
  pageNumber: 0,
  totalPages: 0,
}

const initialState: AbsenceInitialState = {
  absence: null,
  absences: [],
  calendarAbsences: null,
  error: null,
  loadingType: null,
  pagination: initialPagination,
  successType: null,
}

export const getAllAbsences = createAsyncThunk<
  ResponseWithPagebleContent<Absence>,
  AbsencesFilterCriteria | void
>(ABSENCE_GET_ALL, async (filters?) => {
  const response = await api.get('/absences', {
    params: { ...filters },
  })
  return response?.data
})

export const getCalendarAbsences = createAsyncThunk<CalendarAbsence[], CalendarFilterData>(
  ABSENCE_GET_CALENDAR,
  async (filters) => {
    const response = await api.get('/absences/calendar-absences', {
      params: filters,
    })
    return response.data
  }
)

export const getAbsenceById = createAsyncThunk(ABSENCE_GET_ONE, async (userId: number | string) => {
  const response = await api.get(`/absences/${userId}`)
  return response?.data
})

export const createAbsence = createAsyncThunk<Absence, AbsenceData>(
  ABSENCE_CREATE,
  async (data) => {
    const response = await api.post('/absences', data)
    return response?.data.content
  }
)

export const editAbsence = createAsyncThunk<Event, { data: Partial<AbsenceData>; id: string }>(
  ABSENCE_UPDATE,
  async ({ data, id }) => {
    const response = await api.patch(`absences/${id}`, data)
    return response?.data.content
  }
)

export const deleteAbsence = createAsyncThunk<Absence, number>(ABSENCE_DELETE, async (id) => {
  const response = await api.delete(`absences/${id}`)
  return response.data
})

const absenceSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(getAllAbsences.pending, (state) => {
        state.loadingType = ABSENCE_GET_ALL
        state.error = null
      })
      .addCase(getAllAbsences.fulfilled, (state, action) => {
        state.loadingType = null
        state.absences = action.payload.content
        state.pagination.pageNumber = action.payload.number
        state.pagination.totalPages = action.payload.totalPages
      })
      .addCase(getAllAbsences.rejected, (state, action) => {
        state.loadingType = null
        state.absences = []
        state.pagination = initialPagination
        state.error = {
          ...action.error,
          type: ABSENCE_GET_ALL,
        }
      })
      .addCase(getCalendarAbsences.pending, (state) => {
        state.loadingType = ABSENCE_GET_CALENDAR
        state.calendarAbsences = null
        state.error = null
      })
      .addCase(getCalendarAbsences.fulfilled, (state, action) => {
        state.loadingType = null
        state.calendarAbsences = action.payload
      })
      .addCase(getCalendarAbsences.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: ABSENCE_GET_CALENDAR,
        }
      })
      .addCase(getAbsenceById.pending, (state) => {
        state.loadingType = ABSENCE_GET_ONE
        state.error = null
      })
      .addCase(getAbsenceById.fulfilled, (state, action) => {
        state.loadingType = null
        state.absence = action.payload
      })
      .addCase(getAbsenceById.rejected, (state) => {
        state.loadingType = null
        state.absence = null
      })
      .addCase(deleteAbsence.pending, (state) => {
        state.loadingType = ABSENCE_DELETE
        state.error = null
      })
      .addCase(deleteAbsence.fulfilled, (state) => {
        state.loadingType = null
        state.successType = ABSENCE_DELETE
      })
      .addCase(deleteAbsence.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: ABSENCE_DELETE,
        }
      })
      .addCase(createAbsence.pending, (state) => {
        state.loadingType = ABSENCE_CREATE
        state.successType = null
        state.error = null
      })
      .addCase(createAbsence.fulfilled, (state) => {
        state.loadingType = null
        state.successType = ABSENCE_CREATE
      })
      .addCase(createAbsence.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: ABSENCE_CREATE,
        }
      })
      .addCase(editAbsence.pending, (state) => {
        state.loadingType = ABSENCE_UPDATE
        state.successType = null
        state.error = null
      })
      .addCase(editAbsence.fulfilled, (state) => {
        state.loadingType = null
        state.successType = ABSENCE_UPDATE
      })
      .addCase(editAbsence.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: ABSENCE_UPDATE,
        }
      })
  },
  initialState,
  name: 'absences',
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

export const { clearSuccessType, changePageNumber, clearPagination, clearError } =
  absenceSlice.actions
export default absenceSlice.reducer
