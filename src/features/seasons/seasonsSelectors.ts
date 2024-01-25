import type { RootState } from '../../app/store'

const seasonsStateSelector = (state: RootState) => state.seasons

export const selectSeasons = (state: RootState) => seasonsStateSelector(state).seasons

export const selectSeason = (state: RootState) => seasonsStateSelector(state).season

export const selectSeasonIsDeleted = (state: RootState) => seasonsStateSelector(state).isDeleted

export const selectSeasonIsLoading = (state: RootState) => seasonsStateSelector(state).isLoading

export const selectSeasonsError = (state: RootState) => seasonsStateSelector(state).error

export const selectDeleteSeasonModalOpen = (state: RootState) =>
  seasonsStateSelector(state).openDeleteModal

export const selectSeasonId = (state: RootState) => seasonsStateSelector(state).id

export const selectSeasonTablePageSize = (state: RootState) => seasonsStateSelector(state).pageSize

export const selectSeasonTablePageNumber = (state: RootState) =>
  seasonsStateSelector(state).pageNumber

export const selectSeasonTableTotalPages = (state: RootState) =>
  seasonsStateSelector(state).totalPages
