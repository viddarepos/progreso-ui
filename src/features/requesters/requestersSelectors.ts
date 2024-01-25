import type { RootState } from '../../app/store'

const requestersSelector = (state: RootState) => state.requesters

export const selectIsLoading = (state: RootState) => requestersSelector(state).isLoading

export const selectHasError = (state: RootState) => requestersSelector(state).error

export const selectRequesters = (state: RootState) => requestersSelector(state).requesters

export const selectRequesterIds = (state: RootState) =>
  selectRequesters(state).map((requestor) => requestor?.id)
