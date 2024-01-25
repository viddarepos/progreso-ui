import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Alert,
  Button,
  Card,
  Container,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material'
import { Fragment, useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAppDispatch, useAppSelector } from '../app/store'
import { selectLoginError } from '../features/auth/authSelector'
import { loginRequest } from '../features/auth/authSlice'
import { STORAGE_ACCESS_TOKEN_KEY } from '../utils/constants'
import { InputValidationMessages } from '../utils/enums'
import { type LoginFormData } from '../utils/interfaces'

const requiredMessage = yup.string().required(InputValidationMessages.REQUIRED)
const schema = yup
  .object({
    email: requiredMessage,
    password: requiredMessage,
  })
  .required()

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectLoginError)
  const handleShowPassword = () => setShowPassword((show) => !show)

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const dataResult = await dispatch(loginRequest({ email: data.email, password: data.password }))

    if (dataResult.type === loginRequest.fulfilled.toString()) {
      const token = dataResult.payload?.toString()
      if (token) {
        localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, token)
      }
    }
  }

  return (
    <Container
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <Card
        variant='outlined'
        sx={{ display: 'flex', justifyContent: 'center', padding: '3rem 4rem' }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            {error && (
              <Alert
                severity='error'
                variant='filled'
                sx={{
                  backgroundColor: 'error.main',
                  border: '1px solid',
                  borderColor: 'red',
                }}
              >
                {<Fragment>{error.message}</Fragment>}
              </Alert>
            )}
            <InputLabel htmlFor='email' required>
              Email
            </InputLabel>
            <Controller
              name='email'
              control={control}
              render={({ field }) => <OutlinedInput {...field} />}
            />
            <FormHelperText>{errors.email?.message}</FormHelperText>
            <InputLabel htmlFor='password' required>
              Password
            </InputLabel>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='start'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleShowPassword}
                        edge='start'
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  {...field}
                />
              )}
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
            <Button
              type='submit'
              variant='primary'
              sx={{ borderRadius: 6, height: 50, width: 150 }}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  )
}

export default Login
