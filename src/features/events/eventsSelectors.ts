import type { RootState } from '../../app/store'

const eventsSelector = (state: RootState) => state.events

export const selectEvent = (state: RootState) => eventsSelector(state).event

export const selectEvents = (state: RootState) => eventsSelector(state).events

export const selectEventsLoadingType = (state: RootState) => eventsSelector(state).loadingType

export const selectEventsSuccessType = (state: RootState) => eventsSelector(state).successType

export const selectEventsError = (state: RootState) => eventsSelector(state).error
