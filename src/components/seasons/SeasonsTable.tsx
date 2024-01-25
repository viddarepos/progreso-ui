import {
  Box,
  FormControl,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/store'
import { setAlert } from '../../features/alerts/alertsSlice'
import {
  selectDeleteSeasonModalOpen,
  selectSeasonId,
  selectSeasonIsDeleted,
  selectSeasonIsLoading,
  selectSeasonTablePageNumber,
  selectSeasonTablePageSize,
  selectSeasonTableTotalPages,
  selectSeasons,
  selectSeasonsError,
} from '../../features/seasons/seasonsSelectors'
import {
  changePage,
  changePageSize,
  changeToFirstPage,
  clearId,
  clearIsDeleted,
  clearSeasonsError,
  deleteSeason,
  getAllSeasons,
  toggleModal,
} from '../../features/seasons/seasonsSlice'
import useThemeBreakpoints from '../../hooks/useThemeBreakpoints'
import { AlertErrorMessages, AlertSuccessMessages, AlertType } from '../../utils/enums'
import type { Season, SeasonPagination } from '../../utils/interfaces'
import LoadingWrapper from '../../wrappers/LoadingWrapper'
import ConfirmationModal from '../shared/ConfirmationModal'
import Pagination from '../shared/Pagination'

import SeasonItem from './SeasonItem'

const cellStyle = {
  color: 'common.white',
  padding: {
    desktop: '16px',
    laptop: '12px',
    mobile: '5px',
    tablet: '6px',
  },
}

export default function SeasonsTable() {
  const dispatch = useAppDispatch()

  const seasons = useAppSelector(selectSeasons)
  const isLoading = useAppSelector(selectSeasonIsLoading)
  const seasonId = useAppSelector(selectSeasonId)
  const isConfirmationModalOpen = useAppSelector(selectDeleteSeasonModalOpen)
  const isDeleted = useAppSelector(selectSeasonIsDeleted)
  const error = useAppSelector(selectSeasonsError)
  const pageNumber = useAppSelector(selectSeasonTablePageNumber)
  const pageSize = useAppSelector(selectSeasonTablePageSize)
  const totalPages = useAppSelector(selectSeasonTableTotalPages)

  const { tabletBreakpoint, laptopBreakpoint } = useThemeBreakpoints()

  const colSpan = laptopBreakpoint ? 7 : tabletBreakpoint ? 6 : 4

  const fetchSeasonData = (criteria: SeasonPagination) => {
    dispatch(getAllSeasons(criteria))
  }

  const handlePageChange = (page: number) => {
    dispatch(changePage(page))
  }

  const handleResultsPerPageChange = (event: SelectChangeEvent) => {
    const resultsPerPageString = event.target.value
    dispatch(changePageSize(resultsPerPageString))
    dispatch(changeToFirstPage())
  }

  useEffect(() => {
    const criteria: SeasonPagination = {
      page: pageNumber,
      size: pageSize,
    }

    fetchSeasonData(criteria)
  }, [pageNumber, pageSize])

  const getSeasonsAferUpdate = () => {
    const criteria = {
      page: pageNumber,
      size: pageSize,
    }

    fetchSeasonData(criteria)
  }

  useEffect(() => {
    if (isDeleted) {
      dispatch(setAlert({ message: AlertSuccessMessages.SEASONS_DELETE, type: AlertType.SUCCESS }))
      getSeasonsAferUpdate()
      dispatch(clearIsDeleted())
      dispatch(toggleModal())
      dispatch(clearId())
    } else if (error) {
      const errorMessage = typeof error === 'string' ? error : AlertErrorMessages.SEASONS_DELETE
      dispatch(setAlert({ message: errorMessage, type: AlertType.ERROR }))
      dispatch(clearSeasonsError())
    }
  }, [isDeleted, error])

  const toggleConfirmationModal = () => {
    dispatch(toggleModal())
  }

  const handleDeleteSeason = () => {
    dispatch(deleteSeason({ seasonId: Number(seasonId) }))
  }

  return (
    <Box
      sx={{
        marginInline: 'auto',
        width: {
          desktop: '90vw',
          laptop: '90vw',
          largeScreen: '80vw',
          mobile: '95vw',
          tablet: '95vw',
        },
      }}
    >
      <Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
          }}
        >
          <Typography sx={{ color: 'grey.500' }}>Results per page</Typography>
          <FormControl>
            <Select
              sx={{ width: '6rem' }}
              value={String(pageSize)}
              onChange={handleResultsPerPageChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer
          sx={{
            margin: '2rem auto',
          }}
          component={Paper}
        >
          <Table aria-label='simple table' sx={{ fontSize: '0.8rem' }}>
            <TableHead sx={{ backgroundColor: 'grey.500' }}>
              <TableRow>
                <TableCell sx={cellStyle}>Name</TableCell>
                {tabletBreakpoint && <TableCell sx={cellStyle}>Owner</TableCell>}

                {laptopBreakpoint && <TableCell sx={cellStyle}>Duration</TableCell>}

                <TableCell sx={cellStyle}>Start date</TableCell>
                <TableCell sx={cellStyle}>End Date</TableCell>
                {tabletBreakpoint && <TableCell sx={cellStyle}>Technologies</TableCell>}
                <TableCell sx={cellStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <LoadingWrapper isLoading={isLoading} tableColSpan={colSpan}>
                {seasons?.length === 0 ? (
                  <TableRow>
                    <TableCell align='center' colSpan={colSpan} sx={{ padding: '2rem 0' }}>
                      You don't have access to any seasons yet
                    </TableCell>
                  </TableRow>
                ) : (
                  seasons?.map((season: Season) => <SeasonItem key={season.id} season={season} />)
                )}
              </LoadingWrapper>
            </TableBody>
          </Table>
          <Pagination
            totalPages={totalPages}
            pageNumber={pageNumber}
            setPageNumber={handlePageChange}
          />

          <ConfirmationModal
            open={isConfirmationModalOpen}
            onClose={toggleConfirmationModal}
            onConfirm={handleDeleteSeason}
            isLoading={isLoading}
            title='Delete season?'
            content={`Are you sure you want to delete this season?\nThis action cannot be undone.`}
            confirmButtonText='Yes'
          />
        </TableContainer>
      </Box>
    </Box>
  )
}
