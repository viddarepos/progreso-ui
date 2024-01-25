import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../app/store'
import AbsenceItem from '../components/absences/AbsenceItem'
import AbsenceFilterForm from '../components/absences/components/AbsenceFilterForm'
import AbsenceForm from '../components/absences/components/AbsenceForm'
import ConfirmationModal from '../components/shared/ConfirmationModal'
import Pagination from '../components/shared/Pagination'
import {
  selectAbsencesPagination,
  selectAllAbsences,
  selectError,
  selectLoadingType,
  selectSuccessType,
} from '../features/absence/absenceSelectors'
import {
  changePageNumber,
  clearError,
  clearSuccessType,
  createAbsence,
  deleteAbsence,
  editAbsence,
  getAllAbsences,
} from '../features/absence/absenceSlice'
import { setAlert } from '../features/alerts/alertsSlice'
import { selectRequesterIds } from '../features/requesters/requestersSelectors'
import { getRequesters } from '../features/requesters/requestersSlice'
import { selectSeasons } from '../features/seasons/seasonsSelectors'
import { getAllSeasons } from '../features/seasons/seasonsSlice'
import { type AbsencesFilterCriteria } from '../features/slice.types'
import useThemeBreakpoints from '../hooks/useThemeBreakpoints'
import {
  AbsenceSliceActionTypePrefix,
  AlertErrorMessages,
  AlertSuccessMessages,
  AlertType,
  ModalActions,
} from '../utils/enums'
import type { Absence, AbsenceData } from '../utils/interfaces'
import LoadingWrapper from '../wrappers/LoadingWrapper'

export type ModalData = {
  action: ModalActions
  id?: number
  data?: Absence
}

const { ABSENCE_GET_ALL, ABSENCE_CREATE, ABSENCE_UPDATE, ABSENCE_DELETE } =
  AbsenceSliceActionTypePrefix

const getErrorMessage = (errorType: string) => {
  switch (errorType) {
    case ABSENCE_GET_ALL:
      return AlertErrorMessages.ABSENCES_GET_ALL
    case ABSENCE_CREATE:
      return AlertErrorMessages.ABSENCES_CREATE
    case ABSENCE_UPDATE:
      return AlertErrorMessages.ABSENCES_EDIT
    case ABSENCE_DELETE:
      return AlertErrorMessages.ABSENCES_DELETE
    default:
      return 'Error'
  }
}

const getSuccessMessage = (successType: string) => {
  switch (successType) {
    case ABSENCE_DELETE:
      return AlertSuccessMessages.ABSENCES_DELETE
    default:
      return 'Success'
  }
}

const getRequesterIds = (absences: Absence[]) => {
  const uniqueRequesterIds: number[] = absences.reduce((uniqueIds, absence) => {
    if (absence.requesterId !== undefined && !uniqueIds.includes(absence.requesterId)) {
      uniqueIds.push(absence.requesterId)
    }
    return uniqueIds
  }, [] as number[])
  return uniqueRequesterIds
}

export const absenceCellStyle = {
  padding: {
    desktop: '14px',
    laptop: '8px',
    mobile: '6px',
    tablet: '8px',
  },
}

export default function AbsencePage() {
  const dispatch = useAppDispatch()
  const seasons = useAppSelector(selectSeasons)
  const absences = useAppSelector(selectAllAbsences)
  const successType = useAppSelector(selectSuccessType)
  const isLoading = useAppSelector(selectLoadingType)
  const error = useAppSelector(selectError)
  const { pageNumber, totalPages } = useAppSelector(selectAbsencesPagination)
  const storedRequestorIds = useAppSelector(selectRequesterIds)
  const [modalData, setModalData] = useState<ModalData | null>(null)
  const [filterCriteria, setFilterCriteria] = useState<AbsencesFilterCriteria>({})

  const { tabletBreakpoint, laptopBreakpoint } = useThemeBreakpoints()

  const isAbsenceArrayEmpty = absences?.length === 0
  const colSpan = laptopBreakpoint ? 8 : tabletBreakpoint ? 6 : 4

  useEffect(() => {
    dispatch(getAllAbsences({ page: pageNumber, ...filterCriteria }))
  }, [filterCriteria, pageNumber])

  useEffect(() => {
    if (isAbsenceArrayEmpty && totalPages) {
      dispatch(getAllAbsences({ page: pageNumber - 1 }))
    }
  }, [absences?.length])

  useEffect(() => {
    if (absences) {
      const requesterIds = getRequesterIds(absences)

      const requesterIdsThatNeedToBeFetched = requesterIds.filter((id) => {
        return !storedRequestorIds.includes(id)
      })

      if (requesterIdsThatNeedToBeFetched.length > 0) {
        dispatch(getRequesters(requesterIdsThatNeedToBeFetched))
      }
    }
  }, [absences])

  useEffect(() => {
    if (successType) {
      dispatch(setAlert({ message: getSuccessMessage(successType), type: AlertType.SUCCESS }))
      dispatch(clearSuccessType())
      dispatch(getAllAbsences({ page: pageNumber, ...filterCriteria }))
      closeModal()
    }
  }, [successType])

  useEffect(() => {
    if (error) {
      dispatch(setAlert({ message: getErrorMessage(error.type), type: AlertType.ERROR }))
      dispatch(clearError())
    }
  }, [error])

  useEffect(() => {
    dispatch(getAllSeasons())
  }, [])

  const handlePageClick = (newPageNumber: number) => {
    dispatch(changePageNumber(newPageNumber))
  }

  const handleFilterClick = (data: AbsencesFilterCriteria) => {
    setFilterCriteria(data)
    dispatch(changePageNumber(0))
  }

  const handleCreateAbsenceClick = () => {
    setModalData({ action: ModalActions.CREATE })
  }

  const postAbsence = (data: AbsenceData) => {
    dispatch(createAbsence(data))
    closeModal()
  }

  const updateAbsence = (data: AbsenceData, id: string) => {
    dispatch(editAbsence({ data, id }))
    closeModal()
  }

  const deleteOneAbsence = () => {
    dispatch(deleteAbsence(modalData?.id!))
  }

  const closeModal = () => {
    setModalData(null)
  }

  return (
    <>
      <AbsenceFilterForm onSubmit={handleFilterClick} seasons={seasons} />
      <Box
        sx={{
          marginInline: {
            mobile: 'auto',
            tablet: '0',
          },
        }}
      >
        <Button variant='outlined' onClick={handleCreateAbsenceClick}>
          Request absence
        </Button>
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
              {tabletBreakpoint && (
                <>
                  {laptopBreakpoint && (
                    <>
                      <TableCell sx={{ ...absenceCellStyle, color: 'common.white' }}>
                        Title
                      </TableCell>
                      <TableCell sx={{ ...absenceCellStyle, color: 'common.white' }} align='left'>
                        Description
                      </TableCell>
                    </>
                  )}

                  <TableCell sx={{ ...absenceCellStyle, color: 'common.white' }} align='left'>
                    Status
                  </TableCell>

                  <TableCell sx={{ ...absenceCellStyle, color: 'common.white' }} align='left'>
                    Type
                  </TableCell>
                </>
              )}

              <TableCell sx={{ ...absenceCellStyle, color: 'common.white' }} align='left'>
                Requester
              </TableCell>

              <TableCell sx={{ ...absenceCellStyle, color: 'common.white' }} align='left'>
                Start time
              </TableCell>
              <TableCell sx={{ ...absenceCellStyle, color: 'common.white' }} align='left'>
                End time
              </TableCell>
              <TableCell sx={{ color: 'common.white' }} align='left'>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <LoadingWrapper
              isLoading={isLoading === AbsenceSliceActionTypePrefix.ABSENCE_GET_ALL}
              tableColSpan={colSpan}
            >
              {isAbsenceArrayEmpty ? (
                <TableRow>
                  <TableCell align='center' colSpan={colSpan} sx={{ padding: '2rem 0' }}>
                    No absences found
                  </TableCell>
                </TableRow>
              ) : (
                absences?.map((absence) => (
                  <AbsenceItem
                    key={absence.id}
                    absence={absence}
                    seasons={seasons}
                    openModal={setModalData}
                  />
                ))
              )}
            </LoadingWrapper>
          </TableBody>
        </Table>

        {!isAbsenceArrayEmpty && (
          <Pagination
            totalPages={totalPages}
            pageNumber={pageNumber}
            setPageNumber={handlePageClick}
            padding='1rem'
          />
        )}
      </TableContainer>

      <ConfirmationModal
        open={modalData?.action === ModalActions.DELETE}
        onClose={closeModal}
        onConfirm={deleteOneAbsence}
        title='Delete absence?'
        confirmButtonText='Delete'
        content='Are you sure you want to delete this absence?'
        isLoading={isLoading === AbsenceSliceActionTypePrefix.ABSENCE_DELETE}
      />

      {modalData && (
        <AbsenceForm
          open={
            modalData?.action === ModalActions.CREATE || modalData?.action === ModalActions.EDIT
          }
          onClose={closeModal}
          createAbsence={postAbsence}
          editAbsence={updateAbsence}
          modalData={modalData}
        />
      )}
    </>
  )
}
