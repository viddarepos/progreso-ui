import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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
import type { SelectChangeEvent } from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAppSelector } from '../../app/store'
import {
  selectEventRequestsLoadingType,
  selectEventRequestsSuccessType,
} from '../../features/event-requests/requestsSelectors'
import { InputValidationMessages, RequestsSliceActionTypePrefix } from '../../utils/enums'
import type { EventRequest, EventRequestData, User } from '../../utils/interfaces'

const schema = yup
  .object({
    description: yup
      .string()
      .optional()
      .max(510, InputValidationMessages.MAX_LENGTH + '510 characters'),
    seasonId: yup.number().typeError(InputValidationMessages.REQUIRED),
    title: yup
      .string()
      .required(InputValidationMessages.REQUIRED)
      .min(2, InputValidationMessages.MIN_LENGTH + '2 characters')
      .max(64, InputValidationMessages.MAX_LENGTH + '64 characters'),
  })
  .required()

type FormData = {
  id?: number
  description: string
  title: string
  seasonId?: string | number
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EventRequestData) => void
  currentUser: User | null
  oldRequestData?: EventRequest
}

const { REQUESTS_CREATE, REQUESTS_EDIT } = RequestsSliceActionTypePrefix

export default function EventRequestForm({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  oldRequestData,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      description: '',
      id: undefined,
      seasonId: '',
      title: '',
    },
    resolver: yupResolver(schema as yup.AnyObjectSchema),
  })
  const successType = useAppSelector(selectEventRequestsSuccessType)
  const loadingType = useAppSelector(selectEventRequestsLoadingType)
  const isLoading = loadingType === REQUESTS_CREATE || loadingType === REQUESTS_EDIT
  const isUserPartOfSeason = currentUser?.seasons.length! > 0

  useEffect(() => {
    if (oldRequestData) {
      reset({
        description: oldRequestData.description,
        id: oldRequestData.id,
        seasonId: oldRequestData.seasonId,
        title: oldRequestData.title,
      })
    }
  }, [oldRequestData])

  useEffect(() => {
    if (successType === RequestsSliceActionTypePrefix.REQUESTS_CREATE) {
      handleClose()
    }
  }, [successType])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data as EventRequestData)
  }

  const displaySelectedSeason = (selectedSeason: number | string) => {
    if (!isUserPartOfSeason) {
      return "You haven't been added to a season yet"
    }
    return currentUser?.seasons?.find((season) => season.id === selectedSeason)?.name ?? ''
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
        <Typography fontSize={'1.125rem'}>
          {oldRequestData ? 'Update:' : 'Request an event:'}
        </Typography>
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
            render={({ field }) => (
              <OutlinedInput multiline {...field} minRows={4} variant='wide' />
            )}
          />
          <FormHelperText>{errors.description?.message}</FormHelperText>
          {!oldRequestData && (
            <>
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
                      onChange={onChange as (event: SelectChangeEvent<number | string>) => void}
                      renderValue={displaySelectedSeason}
                      disabled={!isUserPartOfSeason}
                      displayEmpty
                      {...rest}
                    >
                      {currentUser?.seasons.map((season) => (
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
              <FormHelperText>{errors.seasonId?.message}</FormHelperText>{' '}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type='submit' form='eventForm' disabled={isLoading}>
          {oldRequestData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
