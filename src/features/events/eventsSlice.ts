import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { api } from '../../utils/axios.config'
import { EventsSliceActionTypePrefix } from '../../utils/enums'
import type { CalendarEvent, Event, EventData } from '../../utils/interfaces'
import type { EventsInitialState } from '../slice.types'

const { EVENTS_GET_ALL, EVENTS_CREATE, EVENTS_GET_ONE, EVENTS_DELETE, EVENTS_EDIT } =
  EventsSliceActionTypePrefix

const initialState: EventsInitialState = {
  error: null,
  event: null,
  events: null,
  loadingType: null,
  successType: null,
}

export const getAllEvents = createAsyncThunk<
  CalendarEvent[],
  { startDate: string; endDate: string }
>(EVENTS_GET_ALL, async (dates) => {
  const response = await api.get('events/calendar-events', { params: dates })
  return response.data
})

export const getEventById = createAsyncThunk<Event, number>(EVENTS_GET_ONE, async (eventId) => {
  const response = await api.get(`events/${eventId}`)
  return response.data
})

export const createEvent = createAsyncThunk<Event, EventData>(EVENTS_CREATE, async (data) => {
  const response = await api.post('events', data)
  return response?.data.content
})

export const editEvent = createAsyncThunk<Event, { data: EventData; id: string }>(
  EVENTS_EDIT,
  async ({ data, id }) => {
    const response = await api.patch(`events/${id}`, data)
    return response?.data.content
  }
)

export const deleteEventById = createAsyncThunk<Event, number>(EVENTS_DELETE, async (eventId) => {
  const response = await api.delete(`events/${eventId}`)
  return response.data
})

const eventsSlice = createSlice({
  extraReducers: (builder) => {
    return builder
      .addCase(getAllEvents.pending, (state) => {
        state.loadingType = EVENTS_GET_ALL
        state.events = null
        state.error = null
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loadingType = null
        state.events = action.payload
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: EVENTS_GET_ALL,
        }
      })
      .addCase(getEventById.pending, (state) => {
        state.loadingType = EVENTS_GET_ONE
        state.error = null
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loadingType = null
        state.event = action.payload
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loadingType = null
        state.event = null
        state.error = {
          ...action.error,
          type: EVENTS_GET_ONE,
        }
      })
      .addCase(deleteEventById.pending, (state) => {
        state.loadingType = EVENTS_DELETE
        state.successType = null
        state.error = null
      })
      .addCase(deleteEventById.fulfilled, (state) => {
        state.loadingType = null
        state.successType = EVENTS_DELETE
      })
      .addCase(deleteEventById.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: EVENTS_DELETE,
        }
      })
      .addCase(createEvent.pending, (state) => {
        state.loadingType = EVENTS_CREATE
        state.successType = null
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state) => {
        state.loadingType = null
        state.successType = EVENTS_CREATE
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: EVENTS_CREATE,
        }
      })
      .addCase(editEvent.pending, (state) => {
        state.loadingType = EVENTS_EDIT
        state.successType = null
        state.error = null
      })
      .addCase(editEvent.fulfilled, (state) => {
        state.loadingType = null
        state.successType = EVENTS_EDIT
      })
      .addCase(editEvent.rejected, (state, action) => {
        state.loadingType = null
        state.error = {
          ...action.error,
          type: EVENTS_EDIT,
        }
      })
  },
  initialState,
  name: 'events',
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccessType: (state) => {
      state.successType = null
    },
  },
})

const eventsReducer = eventsSlice.reducer
export const { clearSuccessType, clearError } = eventsSlice.actions
export default eventsReducer
