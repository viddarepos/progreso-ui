import type { RootState } from '../../app/store'

const locationSelector = (state: RootState) => state.location

export const selectLocation = (state: RootState) => locationSelector(state).locations
