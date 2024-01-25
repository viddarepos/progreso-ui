import type { RootState } from '../../app/store'

const requestsSelector = (state: RootState) => state.requests

export const selectEventRequests = (state: RootState) => requestsSelector(state).requests

export const selectEventRequest = (state: RootState) => requestsSelector(state).request

export const selectEventRequestsLoadingType = (state: RootState) =>
  requestsSelector(state).loadingType

export const selectEventRequestsSuccessType = (state: RootState) =>
  requestsSelector(state).successType

export const selectEventRequestsError = (state: RootState) => requestsSelector(state).error

export const selectEventRequestsPagination = (state: RootState) =>
  requestsSelector(state).pagination
