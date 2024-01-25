import type { RootState } from '../../app/store'

const absenceSelector = (state: RootState) => state.absences

export const selectAllAbsences = (state: RootState) => absenceSelector(state).absences

export const selectCalendarAbsences = (state: RootState) => absenceSelector(state).calendarAbsences

export const selectAbsence = (state: RootState) => absenceSelector(state).absence

export const selectLoadingType = (state: RootState) => absenceSelector(state).loadingType

export const selectSuccessType = (state: RootState) => absenceSelector(state).successType

export const selectError = (state: RootState) => absenceSelector(state).error

export const selectAbsencesPagination = (state: RootState) => absenceSelector(state).pagination
