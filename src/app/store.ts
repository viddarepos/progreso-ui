import type { AnyAction, Reducer } from '@reduxjs/toolkit'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import absenceReducer from '../features/absence/absenceSlice'
import alertsReducer from '../features/alerts/alertsSlice'
import authReducer from '../features/auth/authSlice'
import requestsReducer from '../features/event-requests/requestsSlice'
import eventsReducer from '../features/events/eventsSlice'
import locationReducer from '../features/locations/locationSlice'
import userActionsModalReducer from '../features/modals/userActionsModalSlice'
import profileReducer from '../features/profile/profileSlice'
import requestersReducer from '../features/requesters/requestersSlice'
import seasonsReducer from '../features/seasons/seasonsSlice'
import technologiesReducer from '../features/technologies/technologiesSlice'
import usersReducer from '../features/users/usersSlice'

const combinedReducer = combineReducers({
  absences: absenceReducer,
  alertState: alertsReducer,
  auth: authReducer,
  events: eventsReducer,
  location: locationReducer,
  profile: profileReducer,
  requesters: requestersReducer,
  requests: requestsReducer,
  seasons: seasonsReducer,
  technologiesState: technologiesReducer,
  userActionsModal: userActionsModalReducer,
  users: usersReducer,
})

export type RootState = ReturnType<typeof combinedReducer>

// reset store to initial state on logout
const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'auth/logout') {
    state = {} as RootState
  }
  return combinedReducer(state, action)
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
