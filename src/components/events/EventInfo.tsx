import CloseIcon from '@mui/icons-material/Close'
import TrashCanIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/EditOutlined'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/store'
import {
  selectEvent,
  selectEventsLoadingType,
  selectEventsSuccessType,
} from '../../features/events/eventsSelectors'
import { deleteEventById, getEventById } from '../../features/events/eventsSlice'
import { EventsSliceActionTypePrefix, Role } from '../../utils/enums'
import { getEventInfoDuration, getEventInfoStartTime } from '../../utils/functions'
import type { Event, User } from '../../utils/interfaces'
import LoadingWrapper from '../../wrappers/LoadingWrapper'
import ConfirmationModal from '../shared/ConfirmationModal'

type Props = {
  eventId: number | null
  onClose: () => void
  onEdit: (event: Event) => void
  currentUser: User | null
}
export default function EventInfo({ eventId, onClose, currentUser, onEdit }: Props) {
  const dispatch = useAppDispatch()
  const event = useAppSelector(selectEvent)
  const loadingType = useAppSelector(selectEventsLoadingType)
  const successType = useAppSelector(selectEventsSuccessType)
  const [areAdminButtonsVisible, setAreAdminButtonsVisible] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

  useEffect(() => {
    eventId && dispatch(getEventById(eventId))
  }, [eventId])

  useEffect(() => {
    if (currentUser?.account.role === Role.ADMIN || currentUser?.id === event?.creatorId) {
      setAreAdminButtonsVisible(true)
    }
    return () => {
      setAreAdminButtonsVisible(false)
    }
  }, [currentUser?.account.role, currentUser?.id, event])

  useEffect(() => {
    if (successType === EventsSliceActionTypePrefix.EVENTS_DELETE) {
      onClose()
    }
  }, [successType])

  const handleDeleteEvent = () => {
    toggleConfirmationModal()
    eventId && dispatch(deleteEventById(eventId))
  }

  const handleEditEvent = () => {
    event && onEdit(event)
  }

  const toggleConfirmationModal = () => setIsConfirmationModalOpen((prev) => !prev)

  if (!event) return

  return (
    <>
      <LoadingWrapper isLoading={loadingType === EventsSliceActionTypePrefix.EVENTS_GET_ONE}>
        <Dialog
          open={!!eventId}
          onClose={onClose}
          sx={{
            '& .MuiPaper-root': {
              maxWidth: '550px',
              width: '95vw',
            },
            zIndex: '9999',
          }}
        >
          <DialogTitle
            sx={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between' }}
          >
            <Box
              sx={{
                '@media(max-width: 500px)': {
                  flexDirection: 'column-reverse',
                },
                alignItems: 'flex-start',
                display: 'flex',
                gap: '1rem',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box>
                <Typography fontSize={'1.125rem'} fontWeight={700} paddingTop={0.7}>
                  {event.title}
                </Typography>
                <Typography>{getEventInfoStartTime(event.startTime)}</Typography>
              </Box>
              {areAdminButtonsVisible && (
                <Box
                  sx={{
                    '@media(max-width: 500px)': {
                      alignSelf: 'flex-end',
                    },
                    display: 'flex',
                  }}
                >
                  <IconButton onClick={handleEditEvent}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={toggleConfirmationModal}>
                    <TrashCanIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Description:{' '}
              {event.description.length > 0 ? (
                event.description
              ) : (
                <Typography component='span' sx={{ color: 'grey.500' }}>
                  (none)
                </Typography>
              )}
            </Typography>
            <Typography>Duration: {getEventInfoDuration(Number(event.duration))}</Typography>
          </DialogContent>
        </Dialog>
      </LoadingWrapper>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={toggleConfirmationModal}
        onConfirm={handleDeleteEvent}
        isLoading={loadingType === EventsSliceActionTypePrefix.EVENTS_DELETE}
        title='Delete event?'
        content={`Are you sure you want to delete "${event.title}"?\nThis action cannot be undone.`}
        confirmButtonText='Yes'
      />
    </>
  )
}
