import type { RootState } from '../../app/store'

const alertSelector = (state: RootState) => state.alertState

export const selectAlerts = (state: RootState) => alertSelector(state).alerts
