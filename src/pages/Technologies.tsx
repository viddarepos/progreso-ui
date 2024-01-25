import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../app/store'
import ConfirmationModal from '../components/shared/ConfirmationModal'
import TechnologiesForm from '../components/technologies/TechnologiesForm'
import { TechnologiesItem } from '../components/technologies/TechnologiesItem'
import TechnologiesTable from '../components/technologies/TechnologiesTable'
import { setAlert } from '../features/alerts/alertsSlice'
import {
  selectTechnologiesByPage,
  selectTechnologiesError,
  selectTechnologiesLoadingType,
  selectTechnologiesPagination,
  selectTechnologiesSuccessType,
} from '../features/technologies/technologiesSelector'
import {
  changePageNumber,
  clearError,
  clearSuccessType,
  createTechnology,
  deleteTechnology,
  editTechnology,
  getTechnologiesByPage,
} from '../features/technologies/technologiesSlice'
import {
  AlertErrorMessages,
  AlertSuccessMessages,
  AlertType,
  ModalActions,
  TechnologiesSliceActionTypePrefix,
} from '../utils/enums'
import type { Technology } from '../utils/interfaces'

export type ModalData = {
  action: ModalActions
  id?: number
}

const { TECHNOLOGIES_CREATE, TECHNOLOGIES_DELETE, TECHNOLOGIES_EDIT, TECHNOLOGIES_GET_ONE_PAGE } =
  TechnologiesSliceActionTypePrefix

const getErrorMessage = (errorType: string) => {
  switch (errorType) {
    case TECHNOLOGIES_CREATE:
      return AlertErrorMessages.TECHNOLOGIES_CREATE
    case TECHNOLOGIES_EDIT:
      return AlertErrorMessages.TECHNOLOGIES_EDIT
    case TECHNOLOGIES_DELETE:
      return AlertErrorMessages.TECHNOLOGIES_DELETE
    case TECHNOLOGIES_GET_ONE_PAGE:
      return AlertErrorMessages.TECHNOLOGIES_GET_ONE_PAGE
    default:
      return 'Error'
  }
}

const getSuccessMessage = (successType: string) => {
  switch (successType) {
    case TECHNOLOGIES_CREATE:
      return AlertSuccessMessages.TECHNOLOGIES_CREATE
    case TECHNOLOGIES_EDIT:
      return AlertSuccessMessages.TECHNOLOGIES_EDIT
    case TECHNOLOGIES_DELETE:
      return AlertSuccessMessages.TECHNOLOGIES_DELETE
    default:
      return 'Success'
  }
}

export default function Technologies() {
  const dispatch = useAppDispatch()
  const technologies = useAppSelector(selectTechnologiesByPage)
  const successType = useAppSelector(selectTechnologiesSuccessType)
  const error = useAppSelector(selectTechnologiesError)
  const loadingType = useAppSelector(selectTechnologiesLoadingType)
  const { pageNumber, totalPages } = useAppSelector(selectTechnologiesPagination)
  const [modalData, setModalData] = useState<ModalData | null>(null)
  const isTechnologyFormOpen =
    modalData?.action === ModalActions.EDIT || modalData?.action === ModalActions.CREATE

  useEffect(() => {
    dispatch(getTechnologiesByPage({ page: pageNumber }))
  }, [pageNumber])

  useEffect(() => {
    if (technologies?.length === 0 && totalPages) {
      dispatch(getTechnologiesByPage({ page: pageNumber - 1 }))
    }
  }, [technologies?.length])

  useEffect(() => {
    if (successType) {
      dispatch(setAlert({ message: getSuccessMessage(successType), type: AlertType.SUCCESS }))
      dispatch(clearSuccessType())
      dispatch(getTechnologiesByPage({ page: pageNumber }))
      closeModal()
    }
  }, [successType])

  useEffect(() => {
    if (error) {
      dispatch(setAlert({ message: getErrorMessage(error.type), type: AlertType.ERROR }))
      dispatch(clearError())
    }
  }, [error])

  const handleChangePage = (newPageNumber: number) => {
    dispatch(changePageNumber(newPageNumber))
  }

  const handleCreateClick = () => {
    setModalData({ action: ModalActions.CREATE })
  }

  const createNewTechnology = (data: { name: string }) => {
    dispatch(createTechnology(data))
  }

  const updateTechnology = (data: { id?: number; name: string }) => {
    dispatch(editTechnology(data as Technology))
  }

  const deleteOneTechnology = () => {
    dispatch(deleteTechnology(modalData?.id!))
  }

  const closeModal = () => {
    setModalData(null)
  }
  return (
    <Box alignSelf='center' display='flex' flexDirection='column' width='100%' maxWidth='400px'>
      <Button sx={{ alignSelf: 'end' }} variant='outlined' onClick={handleCreateClick}>
        Create technology
      </Button>
      <TechnologiesTable
        isLoading={loadingType === TECHNOLOGIES_GET_ONE_PAGE}
        pageNumber={pageNumber}
        totalPages={totalPages}
        handleChangePage={handleChangePage}
      >
        {technologies?.map((technology) => (
          <TechnologiesItem key={technology.id} technology={technology} openModal={setModalData} />
        ))}
      </TechnologiesTable>
      {isTechnologyFormOpen && (
        <TechnologiesForm
          onClose={closeModal}
          onSubmit={
            modalData?.action === ModalActions.CREATE ? createNewTechnology : updateTechnology
          }
          id={modalData?.id}
        />
      )}
      <ConfirmationModal
        open={modalData?.action === ModalActions.DELETE}
        onClose={closeModal}
        onConfirm={deleteOneTechnology}
        title='Delete technology?'
        confirmButtonText='Delete'
        content='Are you sure you want to delete this technology?'
        isLoading={loadingType === TECHNOLOGIES_DELETE}
      />
    </Box>
  )
}
