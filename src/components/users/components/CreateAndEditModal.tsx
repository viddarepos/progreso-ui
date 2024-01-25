import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import MuiPhoneNumber from 'material-ui-phone-number-2'
import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAppDispatch, useAppSelector } from '../../../app/store'
import { setAlert } from '../../../features/alerts/alertsSlice'
import { selectLocation } from '../../../features/locations/locationSelectors'
import { getCountries } from '../../../features/locations/locationSlice'
import { selectIsCurrentUserAdmin } from '../../../features/profile/profileSelectors'
import type {
  CreateAndEditUserData,
  CreateAndEditUserDataForm,
} from '../../../features/slice.types'
import { selectAllTechnologies } from '../../../features/technologies/technologiesSelector'
import { getAllTechnologies } from '../../../features/technologies/technologiesSlice'
import {
  selectUserActionErrors,
  selectUsersIsLoading,
} from '../../../features/users/usersSelectors'
import { clearUserActionErrors, createUser, editUser } from '../../../features/users/usersSlice'
import {
  AlertErrorMessages,
  AlertSuccessMessages,
  AlertType,
  InputValidationMessages,
  Role,
  UserModalActions,
} from '../../../utils/enums'
import { getFormatedDateString } from '../../../utils/functions'
import type { Technology, User } from '../../../utils/interfaces'
import './CreateAndEditModal.scss'

const requiredSchemaString = yup.string().required(InputValidationMessages.REQUIRED)

const accountSchema = yup.object().shape({
  email: requiredSchemaString.email(InputValidationMessages.VALID_EMAIL),
  id: yup.number(),
  role: requiredSchemaString,
})

const locationSchema = yup.object().shape({
  city: requiredSchemaString,
  country: requiredSchemaString,
})

const schema = yup.object().shape({
  account: accountSchema,
  dateOfBirth: requiredSchemaString,
  fullName: requiredSchemaString
    .min(3, InputValidationMessages.MIN_LENGTH + '3 characters')
    .max(100, InputValidationMessages.MAX_LENGTH + '100 characters'),
  location: locationSchema,
  phoneNumber: requiredSchemaString.min(9, InputValidationMessages.MIN_LENGTH + '9 numbers'),
})

type Props = {
  onClose: () => void
  action: UserModalActions
  info?: User | null
  onUpdate: () => void
}

const UserModalForm = ({ onClose, action, info, onUpdate }: Props) => {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectUsersIsLoading)
  const userActionErrors = useAppSelector(selectUserActionErrors)
  const allTechnologies = useAppSelector(selectAllTechnologies)
  const allLocations = useAppSelector(selectLocation)
  const userIsAdmin = useAppSelector(selectIsCurrentUserAdmin)

  const {
    control,
    watch,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors },
    reset,
  } = useForm<CreateAndEditUserDataForm>({
    defaultValues: {
      account: {
        email: '',
        id: undefined,
        role: '',
      },
      dateOfBirth: '',
      fullName: '',
      location: {
        city: '',
        country: '',
      },
      phoneNumber: '',
      technologies: [],
    },
    resolver: yupResolver(schema as yup.ObjectSchema<CreateAndEditUserDataForm>),
  })
  const [title, setTitle] = useState<string>('')
  const selectedLocation = watch('location')

  const countriesOption = allLocations?.map((el) => el.country) || []

  useEffect(() => {
    dispatch(getCountries())
  }, [])

  const boxBlurOnLoading = isLoading ? 'blur(0.15rem)' : 'blur(0)'

  useEffect(() => {
    dispatch(getAllTechnologies())
    if (info) {
      reset({
        account: {
          email: info.account.email,
          id: info.id,
          role: info.account.role,
        },
        dateOfBirth: info.dateOfBirth,
        fullName: info.fullName,
        image: undefined,
        location: {
          city: info.location.split('/')[1],
          country: info.location.split('/')[0],
        },
        phoneNumber: info.phoneNumber,
        technologies: info.technologies?.map((tech) => tech.name) ?? [],
      })
    }

    action === UserModalActions.CREATE ? setTitle('Create user') : setTitle('Edit user')
  }, [action, info, reset])

  const selectedCountryCities = useMemo(() => {
    if (selectedLocation?.country) {
      return (
        allLocations?.find((countryData) => countryData?.country === selectedLocation?.country)
          ?.cities ?? []
      )
    }
    return []
  }, [allLocations, selectedLocation?.country])

  useEffect(() => {
    if (userActionErrors) {
      if (isArray(userActionErrors.violations)) {
        userActionErrors.violations.forEach((violation) => {
          if (violation.field !== 'update.file') {
            setError(violation.field as keyof CreateAndEditUserData, { message: violation.error })
          } else {
            setError('image', { message: violation.error.split('update.file: ')[1] })
          }
        })
      } else if (userActionErrors.status === 409) {
        setError('account.email', { message: userActionErrors.detail })
      } else if (userActionErrors.status === 403) {
        setError('account.role', {
          message: "You don't have permission to create an account with this role",
        })
      }
    }
  }, [userActionErrors])

  const handleOnClose = () => {
    onUpdate()
    reset()
    onClose()
  }

  const handleCancelClick = () => {
    reset()
    onClose()
    if (userActionErrors) {
      dispatch(clearUserActionErrors())
    }
  }

  const handleCountryChange = (selectedCountry: string | null) => {
    const cityField = selectedLocation.city
    if (selectedCountry && cityField) {
      setValue('location.city', '')
    }
  }

  const onSubmit: SubmitHandler<CreateAndEditUserDataForm> = async (data) => {
    const locationString = `${data.location.country}/${data.location.city}`

    const reqData: CreateAndEditUserData = { ...data, location: locationString }

    if (action === UserModalActions.CREATE) {
      const dataResult = await dispatch(createUser({ user: reqData }))
      if (dataResult.type === createUser.fulfilled.toString()) {
        handleOnClose()
        dispatch(setAlert({ message: AlertSuccessMessages.USERS_CREATE, type: AlertType.SUCCESS }))
      } else {
        dispatch(setAlert({ message: AlertErrorMessages.USERS_CREATE, type: AlertType.ERROR }))
      }
    } else if (action === UserModalActions.EDIT) {
      const dataResult = await dispatch(editUser({ file: getValues('image'), user: reqData }))

      if (dataResult.type === editUser.fulfilled.toString()) {
        handleOnClose()
        dispatch(setAlert({ message: AlertSuccessMessages.USERS_EDIT, type: AlertType.SUCCESS }))
      } else {
        dispatch(setAlert({ message: AlertErrorMessages.USERS_EDIT, type: AlertType.ERROR }))
      }
    }
  }

  return (
    <Dialog
      open={true}
      onClose={handleCancelClick}
      sx={{
        '& .MuiPaper-root': {
          bgcolor: 'background.paper',
          boxShadow: 20,
          width: '500px',
        },
      }}
    >
      <DialogTitle>
        <Typography sx={{ borderBottom: '1px solid lightGray', width: '100%' }} fontSize={'20px'}>
          {title}
        </Typography>
        <IconButton onClick={handleCancelClick} sx={{ position: 'absolute', right: 10, top: 10 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          filter: boxBlurOnLoading,
          justifyContent: 'center',
          paddingRight: '7px',
          scrollbarGutter: 'stable',
        }}
      >
        <Box
          component='form'
          id='userForm'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ width: '100%' }}
        >
          <InputLabel htmlFor='email' required>
            Email
          </InputLabel>
          <Controller
            name='account.email'
            control={control}
            render={({ field }) => <OutlinedInput {...field} type='email' variant='wide' />}
          />
          <FormHelperText>{errors.account?.email?.message}</FormHelperText>
          {userIsAdmin && (
            <>
              <InputLabel htmlFor='role' required>
                Role
              </InputLabel>
              <Controller
                name='account.role'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                    input={<OutlinedInput variant='wide' />}
                  >
                    <MenuItem value={Role.ADMIN}>Admin</MenuItem>
                    <MenuItem value={Role.INTERN}>Intern</MenuItem>
                    <MenuItem value={Role.MENTOR}>Mentor</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>{errors.account?.role?.message}</FormHelperText>
            </>
          )}

          <InputLabel htmlFor='fullName' required>
            Full name
          </InputLabel>
          <Controller
            name='fullName'
            control={control}
            render={({ field }) => <OutlinedInput {...field} variant='wide' />}
          />
          <FormHelperText>{errors.fullName?.message}</FormHelperText>
          <InputLabel htmlFor='dateOfBirth' required>
            Date of birth
          </InputLabel>
          <Controller
            name='dateOfBirth'
            control={control}
            render={({ field }) => (
              <OutlinedInput
                {...field}
                ref={field.ref}
                type='date'
                inputProps={{ max: getFormatedDateString(new Date()) }}
                variant='wide'
              />
            )}
          />
          <FormHelperText>{errors.dateOfBirth?.message}</FormHelperText>
          <InputLabel htmlFor='phoneNumber' required>
            Phone number
          </InputLabel>
          <Controller
            name='phoneNumber'
            control={control}
            render={({ field: { name, onBlur, onChange, value } }) => (
              <MuiPhoneNumber
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                defaultCountry='bg'
                variant='outlined'
                sx={{
                  '& .MuiInputBase-root': {
                    paddingLeft: '1rem',
                    width: '100%',
                  },
                  width: '100%',
                }}
              />
            )}
          />
          <FormHelperText>{errors.phoneNumber?.message}</FormHelperText>
          <InputLabel htmlFor='location' required>
            Location
          </InputLabel>
          {countriesOption.length > 0 && (
            <Controller
              name='location.country'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={countriesOption}
                  renderInput={(params) => {
                    return <TextField className='locationField' {...params} placeholder='country' />
                  }}
                  onChange={(_event, countryValue) => {
                    field.onChange(countryValue!)
                    handleCountryChange(countryValue)
                  }}
                />
              )}
            />
          )}
          <FormHelperText>{errors.location?.country?.message}</FormHelperText>
          <Controller
            name='location.city'
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={selectedCountryCities}
                renderInput={(params) => (
                  <TextField className='locationField' {...params} placeholder='city' />
                )}
                onChange={(_event, cityValue) => {
                  field.onChange(cityValue!)
                }}
              />
            )}
          />
          <FormHelperText>{errors.location?.city?.message}</FormHelperText>
          {action === UserModalActions.EDIT && (
            <>
              <InputLabel htmlFor='image'>Image</InputLabel>
              <Controller
                name='image'
                control={control}
                render={({ field: { value: _value, onChange, ...field } }) => (
                  <>
                    <OutlinedInput
                      {...field}
                      type='file'
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files && event.target.files[0]) {
                          onChange(event.target.files[0])
                        }
                      }}
                      variant='wide'
                    />
                  </>
                )}
              />
              <FormHelperText>{errors.image?.message}</FormHelperText>
            </>
          )}
          {userIsAdmin && (
            <>
              <InputLabel htmlFor='technologies'>Technologies</InputLabel>
              <Controller
                name='technologies'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(event: any) => field.onChange(event.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                    multiple
                    value={field.value.map((el: any) => el) || []}
                    input={<OutlinedInput variant='wide' />}
                  >
                    {allTechnologies && allTechnologies.length > 0 ? (
                      allTechnologies.map((tech: Technology) => (
                        <MenuItem key={tech.id} value={tech.name}>
                          {tech.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>{}</MenuItem>
                    )}
                  </Select>
                )}
              />
              <FormHelperText>{errors.technologies?.message}</FormHelperText>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '0 24px', paddingBottom: '20px' }}>
        <Button type='submit' variant='primary' form='userForm' disabled={!isEmpty(errors)}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserModalForm
