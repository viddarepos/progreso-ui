import { createSlice, nanoid } from '@reduxjs/toolkit'

import type { AlertData, AlertInitialState } from '../slice.types'

const initialState: AlertInitialState = {
  alerts: [],
}

const alertsSlice = createSlice({
  initialState,
  name: 'alertState',
  reducers: {
    clearAlert: (state, action: { payload: Pick<AlertData, 'id'> }) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload.id)
    },
    clearAllAlerts: (state) => {
      state.alerts = []
    },
    setAlert: (state, action: { payload: Omit<AlertData, 'id'> }) => {
      state.alerts = [...state.alerts, { ...action.payload, id: nanoid() }]
    },
  },
})

const alertsReducer = alertsSlice.reducer
export const { setAlert, clearAlert, clearAllAlerts } = alertsSlice.actions
export default alertsReducer
