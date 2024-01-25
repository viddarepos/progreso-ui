import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
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
  OutlinedInput,
  Typography,
} from '@mui/material'
import isEmpty from 'lodash/isEmpty'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAppDispatch, useAppSelector } from '../../app/store'
import {
  selectTechnologiesError,
  selectTechnologiesLoadingType,
  selectTechnology,
} from '../../features/technologies/technologiesSelector'
import { clearTechnology, getOneTechnology } from '../../features/technologies/technologiesSlice'
import { InputValidationMessages, TechnologiesSliceActionTypePrefix } from '../../utils/enums'
import LoadingWrapper from '../../wrappers/LoadingWrapper'

const schema = yup
  .object({
    name: yup
      .string()
      .required(InputValidationMessages.REQUIRED)
      .max(100, InputValidationMessages.MAX_LENGTH + '100 characters'),
  })
  .required()

type FormData = {
  id?: number
  name: string
}

type Props = {
  onClose: () => void
  onSubmit: (data: { id?: number; name: string }) => void
  id?: number
}

export default function TechnologiesForm({ onClose, onSubmit, id }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    defaultValues: {
      id: undefined,
      name: '',
    },
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
  })
  const dispatch = useAppDispatch()
  const oldTechnologyData = useAppSelector(selectTechnology)
  const error = useAppSelector(selectTechnologiesError)
  const isLoading =
    useAppSelector(selectTechnologiesLoadingType) ===
    TechnologiesSliceActionTypePrefix.TECHNOLOGIES_GET_ONE

  useEffect(() => {
    if (id) {
      dispatch(getOneTechnology(id))
    }
  }, [id])

  useEffect(() => {
    if (id && oldTechnologyData) {
      reset({
        id: oldTechnologyData.id,
        name: oldTechnologyData.name,
      })
    }
  }, [oldTechnologyData])

  useEffect(() => {
    if (error && 'detail' in error) {
      setError('name', { message: error.detail })
    }
  }, [error])

  const handleClose = () => {
    reset()
    onClose()
    if (oldTechnologyData) {
      dispatch(clearTechnology())
    }
  }

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data)
  }

  return (
    <LoadingWrapper isLoading={isLoading}>
      <Dialog
        open={true}
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
            {id ? 'Update this technology:' : 'Add a new technology:'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minHeight: 'max-content' }}>
          <Box component='form' onSubmit={handleSubmit(handleFormSubmit)} id='technologyForm'>
            <InputLabel required>Name</InputLabel>
            <Controller
              name='name'
              control={control}
              render={({ field }) => <OutlinedInput {...field} variant='wide' />}
            />
            <FormHelperText>{errors.name?.message}</FormHelperText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type='submit' form='technologyForm' disabled={isLoading || !isEmpty(errors)}>
            {id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </LoadingWrapper>
  )
}
