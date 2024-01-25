import type {
  EventClickArg,
  EventMountArg,
  EventSourceInput,
  ViewApi,
} from '@fullcalendar/core/index.js'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { DateClickArg } from '@fullcalendar/interaction'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'
import isInteger from 'lodash/isInteger'
import type { LegacyRef } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/store'
import { selectCalendarAbsences, selectLoadingType } from '../../features/absence/absenceSelectors'
import { getCalendarAbsences } from '../../features/absence/absenceSlice'
import {
  selectEvents,
  selectEventsLoadingType,
  selectEventsSuccessType,
} from '../../features/events/eventsSelectors'
import { getAllEvents } from '../../features/events/eventsSlice'
import { selectCurrentUserProfile } from '../../features/profile/profileSelectors'
import useThemeBreakpoints from '../../hooks/useThemeBreakpoints'
import {
  AbsenceSliceActionTypePrefix,
  AbsenceStatus,
  AbsenceType,
  CalendarEventSources,
  EventsSliceActionTypePrefix,
  Role,
} from '../../utils/enums'
import { getEventDuration } from '../../utils/functions'
import type { CalendarAbsence } from '../../utils/interfaces'

type Props = {
  calendarFilters: CalendarEventSources[]
  handleOpenCreateEventForm: (date?: DateClickArg) => void
  handleOpenEventDetails: (id: number, source: CalendarEventSources) => void
  toggleRequestEventModal: () => void
  toggleCheckboxDropdown: (element?: HTMLElement) => void
}

const initialSmallScreenView = 'listMonth'
const initialLargeScreenView = 'dayGridMonth'

const getIsAbsenceAllDayEvent = (absence: CalendarAbsence) =>
  isInteger(dayjs(absence.endTime).diff(absence.startTime, 'd', true))

const getAbsenceExtendedProps = (status: AbsenceStatus, type: AbsenceType) => {
  let color, source
  if (status === AbsenceStatus.PENDING) {
    color = '#ffa200'
    if (type === AbsenceType.SICK_LEAVE) {
      source = CalendarEventSources.PENDING_SICK_LEAVES
    } else {
      source = CalendarEventSources.PENDING_TIME_OFFS
    }
  } else {
    color = '#43a047'
    if (type === AbsenceType.SICK_LEAVE) {
      source = CalendarEventSources.APPROVED_SICK_LEAVES
    } else {
      source = CalendarEventSources.APPROVED_TIME_OFFS
    }
  }
  return { color, source }
}

export default function Calendar({
  calendarFilters,
  handleOpenCreateEventForm,
  handleOpenEventDetails,
  toggleRequestEventModal,
  toggleCheckboxDropdown,
}: Props) {
  const { desktopBreakpoint } = useThemeBreakpoints()
  const calendarRef = useRef<FullCalendar>()
  const dispatch = useAppDispatch()
  const events = useAppSelector(selectEvents)
  const absences = useAppSelector(selectCalendarAbsences)
  const eventsLoading = useAppSelector(selectEventsLoadingType)
  const absencesLoading = useAppSelector(selectLoadingType)
  const eventsSuccessType = useAppSelector(selectEventsSuccessType)
  const currentUser = useAppSelector(selectCurrentUserProfile)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const isIntern = currentUser?.account.role === Role.INTERN
  const isCalendarLoading =
    eventsLoading === EventsSliceActionTypePrefix.EVENTS_GET_ALL ||
    absencesLoading === AbsenceSliceActionTypePrefix.ABSENCE_GET_CALENDAR

  useEffect(() => {
    calendarRef.current?.getApi().refetchEvents()
  }, [calendarFilters])

  useEffect(() => {
    if (!!startDate && !!endDate) {
      dispatch(getAllEvents({ endDate, startDate }))
      dispatch(getCalendarAbsences({ endDate, startDate }))
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (eventsSuccessType) {
      dispatch(getAllEvents({ endDate, startDate }))
    }
  }, [eventsSuccessType])

  const displayEvents: EventSourceInput = (data, successCallback) => {
    setStartDate(dayjs(data.startStr).format('YYYY-MM-DD'))
    setEndDate(dayjs(data.endStr).format('YYYY-MM-DD'))
    if (!isCalendarLoading) {
      successCallback([...calendarAbsences, ...calendarEvents])
    }
  }

  const calendarEvents = useMemo(() => {
    return (
      events?.map((event) => {
        return {
          end: getEventDuration({
            duration: Number(event.duration),
            startTime: event.startTime,
          }).format(),
          id: event.id.toString(),
          source: CalendarEventSources.SCHEDULED_EVENTS,
          start: dayjs(event.startTime).format(),
          title: event.title,
        }
      }) ?? []
    )
  }, [events])

  const calendarAbsences = useMemo(() => {
    return (
      absences?.map((absence) => {
        const { source, color } = getAbsenceExtendedProps(absence.status, absence.absenceType)
        return {
          allDay: getIsAbsenceAllDayEvent(absence),
          color: color,
          end: dayjs(absence.endTime).format(),
          id: absence.id.toString(),
          source: source,
          start: dayjs(absence.startTime).format(),
          title: absence.displayName.replace('_', ' '),
        }
      }) ?? []
    )
  }, [absences])

  const handleScreenResize = ({ view }: { view: ViewApi }) => {
    const calendar = view.calendar
    const isSmallScreen = !desktopBreakpoint
    if (isSmallScreen && view.type === initialLargeScreenView) {
      calendar.changeView(initialSmallScreenView)
    } else if (!isSmallScreen && view.type === initialSmallScreenView) {
      calendar.changeView(initialLargeScreenView)
    }
    toggleCheckboxDropdown()
  }

  const handleEventFiltering = ({ event }: EventMountArg) => {
    if (!calendarFilters.includes(event.extendedProps.source)) {
      event.remove()
    }
  }

  const handleDateClick = (date: DateClickArg) => {
    if (isIntern) return
    handleOpenCreateEventForm(date)
  }

  const handleEventClick = (arg: EventClickArg) => {
    handleOpenEventDetails(Number(arg.event.id), arg.event.extendedProps.source)
  }

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <FullCalendar
        ref={calendarRef as LegacyRef<FullCalendar>}
        height={'calc(100vh - 130px'}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={!desktopBreakpoint ? initialSmallScreenView : initialLargeScreenView}
        windowResize={handleScreenResize}
        headerToolbar={{
          center: 'title',
          end: `${
            'dayGridMonth,timeGridWeek,timeGridDay,listMonth' +
            (!isIntern ? ' createEvent' : ' requestEvent')
          }`,
          start: `${
            'prevYear,prev,next,nextYear today' +
            (!desktopBreakpoint ? ' showCheckboxDropdown' : '')
          }`,
        }}
        customButtons={{
          createEvent: {
            click: () => handleOpenCreateEventForm(),
            text: 'Create Event',
          },
          requestEvent: {
            click: () => toggleRequestEventModal(),
            text: 'Request Event',
          },
          showCheckboxDropdown: {
            click: (_event, element) => toggleCheckboxDropdown(element),
            text: '☰',
          },
        }}
        dateClick={handleDateClick}
        events={displayEvents}
        eventClick={handleEventClick}
        eventDidMount={handleEventFiltering}
        dayMaxEvents // show "more" button when there are too many events to display
        selectable
      />
    </Box>
  )
}
