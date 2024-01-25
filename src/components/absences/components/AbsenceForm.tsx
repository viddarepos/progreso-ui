import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { SelectChangeEvent } from '@mui/material'
import {
  Box,
  Button,
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
  Typography,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import omitBy from 'lodash/omitBy'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAppSelector } from '../../../app/store'
import {
  selectLoadingType as selectAbsenceIsLoading,
  selectSuccessType as selectAbsenceSuccessType,
} from '../../../features/absence/absenceSelectors'
import { selectCurrentUserProfile } from '../../../features/profile/profileSelectors'
import { selectSeasons } from '../../../features/seasons/seasonsSelectors'
import type { ModalData } from '../../../pages/AbsencePage'
import {
  AbsenceSliceActionTypePrefix,
  AbsenceType,
  InputValidationMessages,
  ModalActions,
} from '../../../utils/enums'
import {
  getEventTime,
  getFormattedEventTime,
  setCapitalizedAbsenceType,
} from '../../../utils/functions'
import type { AbsenceData } from '../../../utils/interfaces'

dayjs.extend(utc)

const { ABSENCE_CREATE, ABSENCE_UPDATE } = AbsenceSliceActionTypePrefix

const requiredString = yup.string().required(InputValidationMessages.REQUIRED)
const schema = yup
  .object({
    absenceType: yup
      .mixed<AbsenceType>()
      .oneOf(Object.values(AbsenceType))
      .required(InputValidationMessages.REQUIRED),
    description: yup.string().optional(),
    endTime: yup
      .date()
      .min(yup.ref('startTime'), InputValidationMessages.VALID_END_TIME)
      .typeError(InputValidationMessages.VALID_DATE)
      .required(),
    seasonId: requiredString,
    startTime: yup.date().typeError(InputValidationMessages.VALID_DATE).required(),
    title: requiredString
      .min(2, InputValidationMessages.MIN_LENGTH + '2 characters')
      .max(64, InputValidationMessages.MAX_LENGTH + '64 characters'),
  })
  .required()

type Props = {
  open: boolean
  onClose: () => void
  createAbsence: (data: AbsenceData) => void
  editAbsence: (data: AbsenceData, id: string) => void
  modalData?: ModalData | null
}

type FormData = {
  title: string
  description: string
  absenceType: AbsenceType
  startTime: Dayjs | null
  endTime: Dayjs | null
  seasonId?: string
}

export default function AbsenceForm({
  open,
  onClose,
  createAbsence,
  editAbsence,
  modalData,
}: Props) {
  const currentUser = useAppSelector(selectCurrentUserProfile)
  const isLoading = useAppSelector(selectAbsenceIsLoading)
  const successType = useAppSelector(selectAbsenceSuccessType)
  const seasons = useAppSelector(selectSeasons)
  const isEditingForm = modalData?.action === ModalActions.EDIT
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      absenceType: modalData?.data?.absenceType ?? undefined,
      description: modalData?.data?.description ?? '',
      endTime: getFormattedEventTime(modalData?.data?.endTime, !isEditingForm),
      seasonId: modalData?.data?.seasonId?.toString() ?? '',
      startTime: getFormattedEventTime(modalData?.data?.startTime, !isEditingForm),

      title: modalData?.data?.title ?? '',
    },
    resolver: yupResolver(schema as yup.AnyObjectSchema),
  })

  const modalTitle = isEditingForm ? 'Edit an absence:' : 'Create an absence:'
  const actionButtonText = isEditingForm ? 'SAVE' : 'CREATE'
  const isUserPartOfSeason = currentUser?.seasons?.length! > 0

  const displaySelectedSeason = (selectedSeasonId: string) => {
    if (!isUserPartOfSeason) {
      return "You haven't been added to a season yet"
    }
    const selectedSeason = seasons?.find((season) => season.id === Number(selectedSeasonId))
    return selectedSeason ? selectedSeason.name : ''
  }

  useEffect(() => {
    if (successType === ABSENCE_CREATE || successType === ABSENCE_UPDATE) {
      handleClose()
    }
  }, [successType])

  const handleFormSubmit = (newData: FormData) => {
    const formattedData: Partial<AbsenceData> = getFormatedData(newData)

    if (isEditingForm && modalData?.data?.id) {
      editAbsence(formattedData as Partial<AbsenceData>, modalData?.data?.id?.toString() as string)
    } else {
      createAbsence(formattedData as AbsenceData)
    }
    handleClose()
  }

  const getFormatedData = (data: FormData) => {
    const formattedData: Partial<AbsenceData> = {
      absenceType: data?.absenceType,
      description: data?.description,
      endTime: getEventTime(data?.endTime as Dayjs),
      seasonId: data?.seasonId,
      startTime: getEventTime(data?.startTime as Dayjs),
      title: data?.title,
    }

    const hasStartTimeChanged = !dayjs(modalData?.data?.startTime).isSame(data.startTime)
    const hasEndTimeChanged = !dayjs(modalData?.data?.endTime).isSame(data.endTime)

    const finalFormattedData: AbsenceData | Partial<AbsenceData> = omitBy(
      formattedData,
      (_, key) =>
        (key === 'startTime' && !hasStartTimeChanged) || (key === 'endTime' && !hasEndTimeChanged)
    )

    return finalFormattedData
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
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
        <Box component='form' onSubmit={handleSubmit(handleFormSubmit)} id='absenceForm'>
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
                    field.onChange(value)
                  }}
                  disablePast={!isEditingForm}
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

          <InputLabel required>End time</InputLabel>
          <Controller
            name='endTime'
            control={control}
            render={({ field }) => {
              return (
                <DateTimePicker
                  {...field}
                  onChange={(value) => {
                    field.onChange(value)
                  }}
                  disablePast={!isEditingForm}
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

          {!isEditingForm && (
            <>
              <InputLabel required>Type</InputLabel>
              <Controller
                control={control}
                name='absenceType'
                render={({ field }) => {
                  const { onChange, ...rest } = field
                  return (
                    <Select
                      input={<OutlinedInput variant='wide' />}
                      IconComponent={ExpandMoreIcon}
                      onChange={onChange as (event: SelectChangeEvent<string>) => void}
                      displayEmpty
                      {...rest}
                    >
                      {Object.values(AbsenceType).map((absenceType) => (
                        <MenuItem key={absenceType} value={absenceType}>
                          <ListItemText
                            primary={setCapitalizedAbsenceType(absenceType)}
                            disableTypography
                            sx={{ margin: 0 }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  )
                }}
              />
              <FormHelperText>{errors.absenceType?.message}</FormHelperText>
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
                      {currentUser?.seasons?.map((season) => (
                        <MenuItem key={season.id} value={season.id}>
                          <ListItemText
                            primary={season.name}
                            disableTypography
                            sx={{ margin: 0 }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  )
                }}
              />
              <FormHelperText>{errors.seasonId?.message}</FormHelperText>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ flexBasis: 0, flexGrow: 1 }}>
          Cancel
        </Button>
        <Button
          type='submit'
          form='absenceForm'
          disabled={
            isLoading === AbsenceSliceActionTypePrefix.ABSENCE_CREATE ||
            isLoading === AbsenceSliceActionTypePrefix.ABSENCE_UPDATE
          }
          sx={{ flexBasis: 0, flexGrow: 1 }}
        >
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
