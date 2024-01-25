import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
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
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAppDispatch, useAppSelector } from '../../../app/store'
import { setAlert } from '../../../features/alerts/alertsSlice'
import { selectCurrentUserProfile } from '../../../features/profile/profileSelectors'
import {
  selectUsersError,
  selectUsersIsLoading,
  selectUsersIsPasswordChanged,
} from '../../../features/users/usersSelectors'
import {
  changePassword,
  clearError,
  clearIsPasswordChanged,
} from '../../../features/users/usersSlice'
import {
  AlertErrorMessages,
  AlertSuccessMessages,
  AlertType,
  InputValidationMessages,
} from '../../../utils/enums'
import { fullPasswordPattern, getPasswordPatternErrorMessage } from '../../../utils/passwordPattern'

const requiredField = yup.string().required(InputValidationMessages.REQUIRED)

const schema = yup
  .object({
    confirmPassword: requiredField.oneOf([yup.ref('newPassword'), ''], 'Passwords do not match'),
    newPassword: requiredField.test({
      name: 'pattern',
      skipAbsent: true,
      test: (value, context) => {
        if (!fullPasswordPattern.test(value)) {
          return context.createError({ message: getPasswordPatternErrorMessage(value) })
        }
        return true
      },
    }),
    password: requiredField,
  })
  .required()

type Props = {
  isOpen: boolean
  onClose: () => void
}

type FormData = {
  confirmPassword: string
  newPassword: string
  password: string
}

export function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [passwordFieldsVisibility, setPasswordFieldsVisibility] = useState<{
    [key: string]: boolean
  }>({
    confirmPassword: false,
    newPassword: false,
    password: false,
  })

  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUserProfile)
  const isSuccess = useAppSelector(selectUsersIsPasswordChanged)
  const isLoading = useAppSelector(selectUsersIsLoading)
  const error = useAppSelector(selectUsersError)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    defaultValues: {
      confirmPassword: '',
      newPassword: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setAlert({ message: AlertSuccessMessages.USERS_CHANGE_PASSWORD, type: AlertType.SUCCESS })
      )
      dispatch(clearIsPasswordChanged())
      handleClose()
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      dispatch(
        setAlert({ message: AlertErrorMessages.USERS_CHANGE_PASSWORD, type: AlertType.ERROR })
      )
      dispatch(clearError())
    }
    if (error && 'status' in error && error.status === 409) {
      setError('password', { message: 'Incorrect password' })
    }
  }, [error])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    currentUser &&
      dispatch(
        changePassword({
          newPassword: data.newPassword,
          oldPassword: data.password,
          userId: currentUser.id,
        })
      )
  }

  const handleShowPassword = (field: string) =>
    setPasswordFieldsVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }))

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          '& .MuiFormHelperText-root': {
            width: '260px',
          },
          bgcolor: 'background.paper',
          boxShadow: 24,
        }}
      >
        <DialogTitle>
          <Typography fontSize={'1.125rem'}>Change password:</Typography>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            component='form'
            id='change-password'
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
          >
            <InputLabel htmlFor='password' required>
              Password
            </InputLabel>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  type={passwordFieldsVisibility.password ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='start'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => handleShowPassword('password')}
                        edge='start'
                      >
                        {passwordFieldsVisibility.password ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  {...field}
                />
              )}
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
            <InputLabel htmlFor='newPassword' required>
              New password
            </InputLabel>
            <Controller
              name='newPassword'
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  type={passwordFieldsVisibility.newPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='start'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => handleShowPassword('newPassword')}
                        edge='start'
                      >
                        {passwordFieldsVisibility.newPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  {...field}
                />
              )}
            />
            <FormHelperText>{errors.newPassword?.message}</FormHelperText>
            <InputLabel htmlFor='confirmPassword' required>
              Repeat new password
            </InputLabel>
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  type={passwordFieldsVisibility.confirmPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='start'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => handleShowPassword('confirmPassword')}
                        edge='start'
                      >
                        {passwordFieldsVisibility.confirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  {...field}
                />
              )}
            />
            <FormHelperText>{errors.confirmPassword?.message}</FormHelperText>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            type='submit'
            form='change-password'
            sx={{ fontSize: '12px' }}
            disabled={isLoading}
          >
            Change password
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
