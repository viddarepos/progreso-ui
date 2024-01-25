import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../app/store'
import ApproveRejectForm from '../components/event-requests/ApproveRejectForm'
import EventRequest from '../components/event-requests/EventRequest'
import EventRequestForm from '../components/event-requests/EventRequestForm'
import FilterForm from '../components/event-requests/FilterForm'
import ConfirmationModal from '../components/shared/ConfirmationModal'
import Pagination from '../components/shared/Pagination'
import { setAlert } from '../features/alerts/alertsSlice'
import {
  selectEventRequest,
  selectEventRequests,
  selectEventRequestsError,
  selectEventRequestsLoadingType,
  selectEventRequestsPagination,
  selectEventRequestsSuccessType,
} from '../features/event-requests/requestsSelectors'
import {
  changePageNumber,
  changeRequestStatus,
  clearPagination,
  clearSuccessType,
  editEventRequest,
  getAllRequests,
  getRequestById,
} from '../features/event-requests/requestsSlice'
import { selectCurrentUserProfile } from '../features/profile/profileSelectors'
import { selectRequesterIds } from '../features/requesters/requestersSelectors'
import { getRequesters } from '../features/requesters/requestersSlice'
import { selectSeasons } from '../features/seasons/seasonsSelectors'
import { getAllSeasons } from '../features/seasons/seasonsSlice'
import type { RequestChangeStatusData, RequestsFilterCriteria } from '../features/slice.types'
import { selectUsersIsLoading } from '../features/users/usersSelectors'
import {
  AlertErrorMessages,
  AlertSuccessMessages,
  AlertType,
  EventRequestStatus,
  ModalActions,
  RequestsSliceActionTypePrefix,
} from '../utils/enums'
import type { EventRequestData, EventRequest as IEventRequest, User } from '../utils/interfaces'
import LoadingWrapper from '../wrappers/LoadingWrapper'

export enum ModalType {
  CONFIRMATION,
  APPROVAL,
  REJECTION,
  EDITING,
}

export type ModalData = {
  type: ModalType
  action?: ModalActions
  requestId: number
  seasonMentors?: User[]
  status?: EventRequestStatus
}

const { REQUESTS_CHANGE_STATUS, REQUESTS_GET_ALL, REQUESTS_EDIT } = RequestsSliceActionTypePrefix

const getErrorMessage = (errorType: string) => {
  switch (errorType) {
    case REQUESTS_CHANGE_STATUS:
      return AlertErrorMessages.REQUESTS_CHANGE_STATUS
    case REQUESTS_GET_ALL:
      return AlertErrorMessages.REQUESTS_GET_ALL
    case REQUESTS_EDIT:
      return AlertErrorMessages.REQUESTS_EDIT
    default:
      return 'Error'
  }
}

const getSuccessMessage = (successType: string) => {
  switch (successType) {
    case REQUESTS_CHANGE_STATUS:
      return AlertSuccessMessages.REQUESTS_CHANGE_STATUS
    case REQUESTS_EDIT:
      return AlertSuccessMessages.REQUESTS_EDIT
    default:
      return 'Success'
  }
}

const getRequesterIds = (requests: IEventRequest[]) => {
  const uniqueRequesterIds: number[] = requests.reduce((uniqueIds, request) => {
    if (request.requesterId !== undefined && !uniqueIds.includes(request.requesterId)) {
      uniqueIds.push(request.requesterId)
    }
    return uniqueIds
  }, [] as number[])
  return uniqueRequesterIds
}

export default function EventRequests() {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUserProfile)
  const seasons = useAppSelector(selectSeasons)
  const requests = useAppSelector(selectEventRequests)
  const error = useAppSelector(selectEventRequestsError)
  const successType = useAppSelector(selectEventRequestsSuccessType)
  const loadingType = useAppSelector(selectEventRequestsLoadingType)
  const storedRequestorsIds = useAppSelector(selectRequesterIds)
  const isUserLoading = useAppSelector(selectUsersIsLoading)
  const editingRequestData = useAppSelector(selectEventRequest)
  const { pageNumber, totalPages } = useAppSelector(selectEventRequestsPagination)
  const [openModalData, setOpenModalData] = useState<ModalData | null>(null)
  const [filterCriteria, setFilterCriteria] = useState<RequestsFilterCriteria>({})
  const isRequestArrayEmpty = requests?.length === 0
  const isLoadingRequests = loadingType === REQUESTS_GET_ALL
  const isLoadingStatusChange = loadingType === REQUESTS_CHANGE_STATUS

  useEffect(() => {
    dispatch(getAllRequests())
    dispatch(getAllSeasons())
    return () => {
      dispatch(clearPagination())
    }
  }, [])

  useEffect(() => {
    if (requests) {
      const requesterIds = getRequesterIds(requests)

      const requesterIdsThatNeedToBeFetched = requesterIds.filter((id) => {
        return !storedRequestorsIds.includes(id)
      })

      if (requesterIdsThatNeedToBeFetched.length > 0) {
        dispatch(getRequesters(requesterIdsThatNeedToBeFetched))
      }
    }
  }, [requests])

  useEffect(() => {
    dispatch(getAllRequests({ page: pageNumber, ...filterCriteria }))
  }, [filterCriteria, pageNumber])

  useEffect(() => {
    if (openModalData?.type === ModalType.EDITING) {
      dispatch(getRequestById(openModalData.requestId))
    }
  }, [openModalData])

  useEffect(() => {
    if (successType) {
      dispatch(setAlert({ message: getSuccessMessage(successType), type: AlertType.SUCCESS }))
      dispatch(clearSuccessType())
      dispatch(getAllRequests({ page: pageNumber, ...filterCriteria }))
      closeModal()
    }
  }, [successType])

  useEffect(() => {
    if (error) {
      dispatch(setAlert({ message: getErrorMessage(error.type), type: AlertType.ERROR }))
    }
  }, [error])

  const handlePageClick = (newPageNumber: number) => {
    dispatch(changePageNumber(newPageNumber))
  }

  const handleFilterClick = (data: RequestsFilterCriteria) => {
    setFilterCriteria(data)
    dispatch(changePageNumber(0))
  }

  const approveOrRejectRequest = (
    action: ModalActions,
    formData: { comment: string; assignee?: number }
  ) => {
    updateRequestStatus({
      assignee: formData.assignee,
      comment: formData.comment,
      id: openModalData?.requestId!,
      status:
        action === ModalActions.APPROVE ? EventRequestStatus.APPROVED : EventRequestStatus.REJECTED,
    })
  }

  const changeRequestAssignee = (args: {
    newAssigneeId: number
    requestId: number
    requestStatus: EventRequestStatus
  }) => {
    updateRequestStatus({
      assignee: args.newAssigneeId,
      comment: 'Assignee changed',
      id: args.requestId,
      status: args.requestStatus,
    })
  }

  const markRequestAsScheduled = () => {
    updateRequestStatus({
      comment: 'Event scheduled',
      id: openModalData?.requestId!,
      status: EventRequestStatus.SCHEDULED,
    })
  }

  const updateEventRequest = (data: EventRequestData) => {
    dispatch(editEventRequest(data))
  }

  const updateRequestStatus = (data: RequestChangeStatusData) => {
    dispatch(changeRequestStatus(data))
  }

  const closeModal = () => {
    setOpenModalData(null)
  }

  return (
    <>
      <FilterForm onSubmit={handleFilterClick} seasons={seasons} />
      <Box
        sx={{
          alignSelf: 'center',
          borderColor: 'grey.500',
          borderTop: '1px solid',
          maxWidth: '1000px',
          minHeight: '40vh',
          position: 'relative',
          width: {
            desktop: '90vw',
            laptop: '90vw',
            largeScreen: '80vw',
            mobile: '90vw',
          },
        }}
      >
        <LoadingWrapper isLoading={isLoadingRequests || isUserLoading}>
          <Box>
            {requests?.map((request, index) => (
              <EventRequest
                key={request.id}
                data={request}
                isLast={requests.length - 1 === index}
                currentUser={currentUser}
                seasons={seasons}
                openModal={setOpenModalData}
                changeRequestAssignee={changeRequestAssignee}
              />
            ))}
            {isRequestArrayEmpty && (
              <Typography color='grey.800' fontStyle='italic' align='center' padding={'2rem'}>
                No requests found
              </Typography>
            )}
          </Box>
          {!isRequestArrayEmpty && (
            <Pagination
              totalPages={totalPages}
              pageNumber={pageNumber}
              setPageNumber={handlePageClick}
              padding='1.5rem'
            />
          )}
        </LoadingWrapper>
      </Box>
      <ConfirmationModal
        open={openModalData?.type === ModalType.CONFIRMATION}
        onConfirm={markRequestAsScheduled}
        onClose={closeModal}
        title='Mark as scheduled?'
        content={`Would you like to mark this event as SCHEDULED?\n\nThis action cannot be undone`}
        confirmButtonText='YES'
        isLoading={isLoadingStatusChange}
      />
      <ApproveRejectForm
        onClose={closeModal}
        onConfirm={approveOrRejectRequest}
        action={openModalData?.action}
        mentors={openModalData?.seasonMentors}
        isLoading={isLoadingStatusChange}
      />
      {editingRequestData && (
        <EventRequestForm
          isOpen={openModalData?.type === ModalType.EDITING}
          onClose={closeModal}
          currentUser={currentUser}
          onSubmit={updateEventRequest}
          oldRequestData={editingRequestData}
        />
      )}
    </>
  )
}
