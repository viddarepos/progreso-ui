import type { RootState } from '../../app/store'

const technologiesStateSelector = (state: RootState) => state.technologiesState

export const selectAllTechnologies = (state: RootState) =>
  technologiesStateSelector(state).technologies

export const selectTechnologiesByPage = (state: RootState) =>
  technologiesStateSelector(state).technologiesByPage

export const selectTechnology = (state: RootState) => technologiesStateSelector(state).technology

export const selectTechnologiesPagination = (state: RootState) =>
  technologiesStateSelector(state).pagination

export const selectTechnologiesLoadingType = (state: RootState) =>
  technologiesStateSelector(state).loadingType

export const selectTechnologiesSuccessType = (state: RootState) =>
  technologiesStateSelector(state).successType

export const selectTechnologiesError = (state: RootState) => technologiesStateSelector(state).error
