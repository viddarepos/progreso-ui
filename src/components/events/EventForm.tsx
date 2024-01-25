import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PersonIcon from '@mui/icons-material/Person'
import OutlinedPersonIcon from '@mui/icons-material/PersonOutline'
import type { SelectChangeEvent } from '@mui/material'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Tooltip,
  Typography,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import type { MouseEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import * as yup from 'yup'

import { useAppDispatch, useAppSelector } from '../../app/store'
import {
  selectEventsLoadingType,
  selectEventsSuccessType,
} from '../../features/events/eventsSelectors'
import { selectSeasons } from '../../features/seasons/seasonsSelectors'
import { getAllSeasons } from '../../features/seasons/seasonsSlice'
import { selectUsers } from '../../features/users/usersSelectors'
import { getAllUsers } from '../../features/users/usersSlice'
import { EventsSliceActionTypePrefix, InputValidationMessages, Role } from '../../utils/enums'
import {
  getEventDuration,
  getEventDurationInMin,
  getEventDurationString,
  getEventTime,
  getFormattedEventTime,
  updateEventDurationString,
} from '../../utils/functions'
import type { Event, EventData, User } from '../../utils/interfaces'

dayjs.extend(duration)
dayjs.extend(utc)

const { EVENTS_CREATE, EVENTS_EDIT } = EventsSliceActionTypePrefix

const requiredString = yup.string().required(InputValidationMessages.REQUIRED)

const schema = yup
  .object({
    attendees: yup
      .array(yup.number())
      .min(1, InputValidationMessages.CHOOSE_ONE + 'attendee')
      .required(InputValidationMessages.REQUIRED),
    description: yup.string().optional(),
    duration: requiredString.test({
      name: 'is-time',
      test: (value, ctx) => {
        if (!dayjs(value, 'HH:mm', true).isValid()) {
          return ctx.createError({ message: InputValidationMessages.VALID_TIME })
        }
        if (value === '00:00') {
          return ctx.createError({ message: InputValidationMessages.MIN_DURATION + '1 minute' })
        }
        return true
      },
    }),
    endTime: yup.date().typeError(InputValidationMessages.VALID_DATE).optional(),
    seasonId: requiredString,
    startTime: yup.date().typeError(InputValidationMessages.REQUIRED).required(),
    title: requiredString
      .min(2, InputValidationMessages.MIN_LENGTH + '2 characters')
      .max(64, InputValidationMessages.MAX_LENGTH + '64 characters'),
  })
  .required()

type Props = {
  isOpen: boolean
  onClose: () => void
  createEvent: (data: EventData) => void
  editEvent: (data: EventData, id: string) => void
  data?: Partial<Event>
}

type FormData = {
  attendees: number[]
  description: string
  duration: string
  startTime: Dayjs | null
  endTime: Dayjs | null
  title: string
  seasonId: string
}

export default function EventForm({ isOpen, onClose, data, createEvent, editEvent }: Props) {
  const dispatch = useAppDispatch()
  const seasons = useAppSelector(selectSeasons)
  const users = useAppSelector(selectUsers)
  const loadingType = useAppSelector(selectEventsLoadingType)
  const successType = useAppSelector(selectEventsSuccessType)
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      attendees: data?.attendees?.map((attendee) => attendee.id) ?? [],
      description: data?.description ?? '',
      duration: data?.duration ? getEventDurationString(Number(data.duration)) : '01:00',
      endTime: data?.duration
        ? getEventDuration({ duration: data.duration, startTime: data.startTime!.toString() })
        : getFormattedEventTime(data?.startTime).add(1, 'h'),
      seasonId: data?.seasonId?.toString() ?? '',
      startTime: getFormattedEventTime(data?.startTime),
      title: data?.title ?? '',
    },
    resolver: yupResolver(schema as yup.AnyObjectSchema),
  })
  const [requiredAttendees, setRequiredAttendees] = useState<number[]>([])
  const [optionalAttendees, setOptionalAttendees] = useState<number[]>([])
  const selectedAttendees = watch('attendees')
  const selectedSeasonId = watch('seasonId')
  const selectedStartTime = watch('startTime')
  const selectedEndTime = watch('endTime')
  const seasonUsers = useMemo(() => {
    return selectedSeasonId && users.length > 0
      ? users.reduce((acc, user) => {
          user.seasons.forEach((season) => {
            if (season.id.toString() === selectedSeasonId) {
              acc.push(user)
            }
          })
          if (user.account.role === Role.ADMIN) {
            acc.push(user)
          }
          return acc
        }, [] as User[])
      : []
  }, [selectedSeasonId, users])
  const isEditingForm = data?.id ? true : false
  const modalTitle = isEditingForm ? 'Edit an event:' : 'Create an event:'
  const actionButtonText = isEditingForm ? 'SAVE' : 'CREATE'
  const isUserPartOfSeason = seasons?.length! > 0
  const seasonHasUsers = seasonUsers.length > 0
  const isLoading =
    loadingType === EventsSliceActionTypePrefix.EVENTS_CREATE ||
    loadingType === EventsSliceActionTypePrefix.EVENTS_EDIT

  useEffect(() => {
    dispatch(getAllSeasons())
    dispatch(getAllUsers({}))
  }, [])

  useEffect(() => {
    const required = selectedAttendees.filter((id) => !optionalAttendees.includes(id))
    setRequiredAttendees(required)
    setOptionalAttendees((prev) => prev.filter((id) => selectedAttendees.includes(id)))
  }, [selectedAttendees])

  useEffect(() => {
    if (data?.attendees) {
      const attendees = data.attendees.reduce(
        (acc, attendee) => {
          if (attendee.required) {
            acc.required.push(attendee.id)
          } else {
            acc.optional.push(attendee.id)
          }
          return acc
        },
        { optional: [], required: [] } as { optional: number[]; required: number[] }
      )
      setOptionalAttendees(attendees.optional)
      setRequiredAttendees(attendees.required)
    }
  }, [data?.attendees])

  useEffect(() => {
    if (successType === EVENTS_CREATE || successType === EVENTS_EDIT) {
      handleClose()
    }
  }, [successType])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleStartTimeChange = (
    newStartTime: Dayjs | null,
    onChange: (event: Dayjs | React.ChangeEvent<Element> | null) => void
  ) => {
    if (newStartTime && selectedEndTime) {
      const newEndDate = dayjs(selectedEndTime)
        .date(newStartTime.date())
        .month(newStartTime.month())
        .year(newStartTime.year())
      setValue('endTime', newEndDate)
      updateDurationField(newStartTime, newEndDate)
    }
    onChange(newStartTime)
  }

  const handleEndTimeChange = (
    newEndTime: Dayjs | null,
    onChange: (event: Dayjs | React.ChangeEvent<Element> | null) => void
  ) => {
    if (newEndTime && selectedStartTime) {
      updateDurationField(selectedStartTime, newEndTime)
    }
    onChange(newEndTime)
  }

  const handleDurationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (event: string | React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const { value } = event.target
    const newDuration = Number(getEventDurationInMin(value))
    if (newDuration && selectedStartTime) {
      const newEndTime = getEventDuration({
        duration: newDuration,
        startTime: selectedStartTime.toString(),
      })
      setValue('endTime', newEndTime)
    }
    onChange(value)
  }

  const updateDurationField = (startTime: Dayjs, endTime: Dayjs) => {
    setValue('duration', updateEventDurationString(startTime, endTime))
    if (errors.duration) {
      clearErrors('duration')
    }
  }

  const handleFormSubmit = (newData: FormData) => {
    const formatedData: EventData = getFormatedData(newData)
    if (isEditingForm && data?.id) {
      editEvent(formatedData, data.id.toString())
    } else {
      createEvent(formatedData)
    }
  }

  const getFormatedData = (data: FormData) => {
    return {
      description: data.description,
      duration: getEventDurationInMin(data.duration),
      optionalAttendees: optionalAttendees,
      requiredAttendees: requiredAttendees,
      seasonId: data.seasonId,
      startTime: getEventTime(data.startTime as Dayjs),
      title: data.title,
    }
  }

  const displayChecked = (selectedUsersIds: number[], userId: number) => {
    return selectedUsersIds.includes(userId)
  }

  const displaySelectedSeason = (selectedSeason: string) => {
    if (!isUserPartOfSeason) {
      return "You haven't been added to a season yet"
    }
    return seasons?.find((season) => season.id === Number(selectedSeason))?.name ?? ''
  }

  const displaySelectedUsers = (selectedUsersIds: number[]) => {
    if (!seasonHasUsers) {
      return 'No users were found for the selected season'
    }
    return users
      .reduce<string[]>((acc, user) => {
        if (selectedUsersIds.includes(user.id)) {
          acc.push(user.fullName)
        }
        return acc
      }, [])
      .join(', ')
  }

  const toggleRequiredAttendee = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const userId = Number(event.currentTarget.name)
    if (selectedAttendees.includes(userId)) {
      if (requiredAttendees?.includes(userId)) {
        setRequiredAttendees((prev) => prev?.filter((id) => id !== userId))
        setOptionalAttendees((prev) => [...prev, userId])
      } else {
        setRequiredAttendees((prev) => [...prev, userId])
        setOptionalAttendees((prev) => prev?.filter((id) => id !== userId))
      }
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          maxWidth: '500px',
          width: '95vw',
        },
      }}
    >
      <DialogTitle>
        <Typography fontSize={'1.125rem'}>{modalTitle}</Typography>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 10, top: 10 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component='form' onSubmit={handleSubmit(handleFormSubmit)} id='eventForm'>
          <InputLabel required>Title</InputLabel>
          <Controller
            name='title'
            control={control}
            render={({ field }) => <OutlinedInput {...field} variant='wide' />}
          />
          <FormHelperText>{errors.title?.message}</FormHelperText>
          <InputLabel>Description</InputLabel>
          <Controller
            name='description'
            control={control}
            render={({ field }) => <OutlinedInput {...field} variant='wide' />}
          />
          <InputLabel required>Start time</InputLabel>
          <Controller
            name='startTime'
            control={control}
            render={({ field }) => {
              return (
                <DateTimePicker
                  {...field}
                  onChange={(value) => {
                    handleStartTimeChange(value, field.onChange)
                  }}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  sx={{
                    '& .MuiIconButton-root': { right: '50%' },
                    '& .MuiInputBase-root': {
                      width: '100%',
                    },
                    width: '100%',
                  }}
                />
              )
            }}
          />
          <InputLabel>End time</InputLabel>
          <Controller
            name='endTime'
            control={control}
            render={({ field }) => {
              return (
                <DateTimePicker
                  {...field}
                  onChange={(value) => {
                    handleEndTimeChange(value, field.onChange)
                  }}
                  minDateTime={selectedStartTime ?? undefined}
                  maxDate={selectedStartTime ?? undefined}
                  openTo='hours'
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  sx={{
                    '& .MuiIconButton-root': { right: '50%' },
                    '& .MuiInputBase-root': {
                      width: '100%',
                    },
                    width: '100%',
                  }}
                />
              )
            }}
          />
          <FormHelperText>{errors.endTime?.message}</FormHelperText>
          <InputLabel required>Duration</InputLabel>
          <Controller
            name='duration'
            control={control}
            render={({ field: { ref: _ref, onChange, ...rest } }) => (
              <PatternFormat
                {...rest}
                onChange={(event) => handleDurationChange(event, onChange)}
                customInput={OutlinedInput}
                style={{ width: '100%' }}
                displayType='input'
                placeholder='hh:mm'
                format='##:##'
                patternChar='#'
                mask={['h', 'h', 'm', 'm']}
              />
            )}
          />
          <FormHelperText>{errors.duration?.message}</FormHelperText>
          <InputLabel required>Season</InputLabel>
          <Controller
            control={control}
            name='seasonId'
            render={({ field }) => {
              const { onChange, ...rest } = field
              return (
                <Select
                  input={<OutlinedInput variant='wide' />}
                  IconComponent={ExpandMoreIcon}
                  onChange={onChange as (event: SelectChangeEvent<string>) => void}
                  renderValue={displaySelectedSeason}
                  disabled={!isUserPartOfSeason}
                  displayEmpty
                  {...rest}
                >
                  {seasons?.map((season) => (
                    <MenuItem key={season.id} value={season.id.toString()}>
                      <ListItemText primary={season.name} disableTypography sx={{ margin: 0 }} />
                    </MenuItem>
                  ))}
                </Select>
              )
            }}
          />
          <FormHelperText>{errors.seasonId?.message}</FormHelperText>
          {selectedSeasonId && (
            <>
              <InputLabel required>Attendees</InputLabel>
              <Controller
                name='attendees'
                control={control}
                render={({ field }) => {
                  const { onChange, ...rest } = field
                  return (
                    <Select
                      input={<OutlinedInput variant='wide' />}
                      IconComponent={ExpandMoreIcon}
                      multiple
                      renderValue={displaySelectedUsers}
                      onChange={onChange as (event: SelectChangeEvent<number[]>) => void}
                      disabled={!seasonHasUsers}
                      displayEmpty
                      {...rest}
                    >
                      {seasonUsers?.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Checkbox checked={displayChecked(field.value, user.id)} />
                          <ListItemText primary={user.fullName} />
                          <Tooltip
                            title={requiredAttendees?.includes(user.id) ? 'Required' : 'Optional'}
                          >
                            <IconButton name={`${user.id}`} onClick={toggleRequiredAttendee}>
                              {requiredAttendees?.includes(user.id) ? (
                                <PersonIcon />
                              ) : (
                                <OutlinedPersonIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </MenuItem>
                      ))}
                    </Select>
                  )
                }}
              />
              <FormHelperText>{errors.attendees?.message}</FormHelperText>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type='submit' form='eventForm' disabled={isLoading}>
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
