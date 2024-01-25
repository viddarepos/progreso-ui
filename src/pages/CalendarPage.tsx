import type { DateClickArg } from '@fullcalendar/interaction/index.js'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../app/store'
import AbsenceInfo from '../components/absences/components/AbsenceInfo'
import Calendar from '../components/calendar/Calendar'
import CheckboxPanel from '../components/calendar/CheckboxPanel'
import EventRequestForm from '../components/event-requests/EventRequestForm'
import EventForm from '../components/events/EventForm'
import EventInfo from '../components/events/EventInfo'
import { selectError as selectAbsencesError } from '../features/absence/absenceSelectors'
import { clearError as clearAbsencesError } from '../features/absence/absenceSlice'
import { setAlert } from '../features/alerts/alertsSlice'
import {
  selectEventRequestsError,
  selectEventRequestsSuccessType,
} from '../features/event-requests/requestsSelectors'
import {
  clearError as clearRequestsError,
  clearSuccessType as clearRequestsSuccessType,
  createEventRequest,
} from '../features/event-requests/requestsSlice'
import { selectEventsError, selectEventsSuccessType } from '../features/events/eventsSelectors'
import {
  clearError as clearEventsError,
  clearSuccessType as clearEventsSuccessType,
  createEvent,
  editEvent,
} from '../features/events/eventsSlice'
import { selectCurrentUserProfile } from '../features/profile/profileSelectors'
import {
  AlertErrorMessages,
  AlertSuccessMessages,
  AlertType,
  CalendarEventSources,
  EventsSliceActionTypePrefix,
  RequestsSliceActionTypePrefix,
} from '../utils/enums'
import type { Event, EventData, EventRequestData } from '../utils/interfaces'

const { EVENTS_GET_ALL, EVENTS_CREATE, EVENTS_DELETE, EVENTS_GET_ONE, EVENTS_EDIT } =
  EventsSliceActionTypePrefix
const { REQUESTS_CREATE } = RequestsSliceActionTypePrefix

const getErrorMessage = (errorType: string) => {
  switch (errorType) {
    case EVENTS_CREATE:
      return AlertErrorMessages.EVENTS_CREATE
    case EVENTS_GET_ALL:
      return AlertErrorMessages.EVENTS_GET_ALL
    case REQUESTS_CREATE:
      return AlertErrorMessages.REQUESTS_CREATE
    case EVENTS_DELETE:
      return AlertErrorMessages.EVENTS_DELETE
    case EVENTS_GET_ONE:
      return AlertErrorMessages.EVENTS_GET_ONE
    case EVENTS_EDIT:
      return AlertErrorMessages.EVENTS_EDIT
    default:
      return 'Error'
  }
}

const getSuccessMessage = (successType: string) => {
  switch (successType) {
    case EVENTS_CREATE:
      return AlertSuccessMessages.EVENTS_CREATE
    case REQUESTS_CREATE:
      return AlertSuccessMessages.REQUESTS_CREATE
    case EVENTS_DELETE:
      return AlertSuccessMessages.EVENTS_DELETE
    case EVENTS_EDIT:
      return AlertSuccessMessages.EVENTS_EDIT
    default:
      return 'Success'
  }
}

export default function CalendarPage() {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUserProfile)
  const eventsSuccessType = useAppSelector(selectEventsSuccessType)
  const requestSuccessType = useAppSelector(selectEventRequestsSuccessType)
  const eventsError = useAppSelector(selectEventsError)
  const absencesError = useAppSelector(selectAbsencesError)
  const requestsError = useAppSelector(selectEventRequestsError)

  const [isEventFormOpen, setIsEventFormOpen] = useState(false)
  const [isRequestEventFormOpen, setIsRequestEventFormOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<{
    id: number
    source: CalendarEventSources
  } | null>(null)
  const [eventData, setEventData] = useState<Partial<Event> | undefined>(undefined)
  const [checkboxMenuAnchor, setCheckboxMenuAnchor] = useState<HTMLElement | null>(null)
  const [calendarFilters, setCalendarFilters] = useState<CalendarEventSources[]>([
    CalendarEventSources.SCHEDULED_EVENTS,
    CalendarEventSources.APPROVED_SICK_LEAVES,
    CalendarEventSources.APPROVED_TIME_OFFS,
  ])

  useEffect(() => {
    if (eventsSuccessType) {
      dispatch(setAlert({ message: getSuccessMessage(eventsSuccessType), type: AlertType.SUCCESS }))
      dispatch(clearEventsSuccessType())
    }
  }, [eventsSuccessType])

  useEffect(() => {
    if (requestSuccessType) {
      dispatch(
        setAlert({ message: getSuccessMessage(requestSuccessType), type: AlertType.SUCCESS })
      )
      dispatch(clearRequestsSuccessType())
    }
  }, [requestSuccessType])

  useEffect(() => {
    if (eventsError) {
      dispatch(setAlert({ message: getErrorMessage(eventsError.type), type: AlertType.ERROR }))
      dispatch(clearEventsError())
    }
  }, [eventsError])

  useEffect(() => {
    if (requestsError) {
      dispatch(setAlert({ message: getErrorMessage(requestsError.type), type: AlertType.ERROR }))
      dispatch(clearRequestsError())
    }
  }, [requestsError])

  useEffect(() => {
    if (absencesError) {
      dispatch(setAlert({ message: AlertErrorMessages.ABSENCES_GET_ALL, type: AlertType.ERROR }))
      dispatch(clearAbsencesError())
    }
  }, [absencesError])

  const toggleCheckboxDropdown = (element?: HTMLElement) => {
    if (checkboxMenuAnchor || !element) {
      setCheckboxMenuAnchor(null)
    } else {
      setCheckboxMenuAnchor(element)
    }
  }

  // create a new event
  const handleOpenCreateEvent = (date?: DateClickArg) => {
    if (date) {
      setEventData({ startTime: date.date })
    }
    setIsEventFormOpen(true)
  }

  const handleCloseCreateEvent = () => {
    setIsEventFormOpen(false)
    setEventData(undefined)
  }

  const postEvent = (data: EventData) => {
    dispatch(createEvent(data))
  }

  //create a new event request
  const toggleRequestEventModal = () => setIsRequestEventFormOpen((prev) => !prev)

  const postEventRequest = (data: EventRequestData) => {
    dispatch(createEventRequest(data))
  }

  // edit an event
  const handleEditEventClick = (data: Event) => {
    setEventData(data)
    setIsEventFormOpen(true)
    closeEventDetails()
  }

  const postEditEvent = (data: EventData, id: string) => {
    dispatch(editEvent({ data, id }))
  }

  // display event details
  const openEventDetails = (id: number, source: CalendarEventSources) => {
    setSelectedEvent({ id, source })
  }
  const closeEventDetails = () => setSelectedEvent(null)

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: { desktop: 'max-content 1fr', tablet: '1fr' },
        margin: '0 auto',
        maxWidth: '1500px',
        width: '100%',
      }}
    >
      <CheckboxPanel
        anchor={checkboxMenuAnchor}
        onClose={toggleCheckboxDropdown}
        filters={calendarFilters}
        setFilters={setCalendarFilters}
      />
      <Calendar
        calendarFilters={calendarFilters}
        handleOpenCreateEventForm={handleOpenCreateEvent}
        handleOpenEventDetails={openEventDetails}
        toggleRequestEventModal={toggleRequestEventModal}
        toggleCheckboxDropdown={toggleCheckboxDropdown}
      />
      {/* EventForm is conditionally rendered in order to pass the correct default value to the DateTimePicker */}
      {isEventFormOpen && (
        <EventForm
          isOpen={isEventFormOpen}
          onClose={handleCloseCreateEvent}
          data={eventData}
          createEvent={postEvent}
          editEvent={postEditEvent}
        />
      )}
      <EventRequestForm
        isOpen={isRequestEventFormOpen}
        onClose={toggleRequestEventModal}
        onSubmit={postEventRequest}
        currentUser={currentUser}
      />
      {selectedEvent?.source === CalendarEventSources.SCHEDULED_EVENTS ? (
        <EventInfo
          eventId={selectedEvent?.id ?? null}
          onClose={closeEventDetails}
          onEdit={handleEditEventClick}
          currentUser={currentUser}
        />
      ) : (
        <AbsenceInfo absenceId={selectedEvent?.id ?? null} onClose={closeEventDetails} />
      )}
    </Box>
  )
}
