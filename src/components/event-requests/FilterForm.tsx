import { Box, Button, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import { Controller, useForm } from 'react-hook-form'

import type { RequestsFilterCriteria } from '../../features/slice.types'
import { EventRequestStatus } from '../../utils/enums'
import type { Season } from '../../utils/interfaces'

type Props = {
  seasons: Season[] | null
  onSubmit: (data: RequestsFilterCriteria) => void
}

export default function FilterForm({ seasons, onSubmit }: Props) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      seasonId: '',
      status: '' as EventRequestStatus,
    },
  })

  const handleFormSubmit = (formData: RequestsFilterCriteria) => {
    const filterData = omitBy(formData, (param) => !param)
    if (!isEmpty(filterData)) {
      onSubmit(filterData)
    }
  }

  const handleReset = () => {
    reset()
    onSubmit({})
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        alignItems: {
          mobile: 'center',
          tablet: 'end',
        },
        display: 'flex',
        flexDirection: {
          mobile: 'column',
          tablet: 'row',
        },
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
        marginBlock: '2rem',
      }}
    >
      <Box>
        <InputLabel htmlFor='filterRole'>Status</InputLabel>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onChange={(event) => field.onChange(event.target.value as EventRequestStatus)}
              input={<OutlinedInput />}
            >
              <MenuItem value={EventRequestStatus.APPROVED}>Approved</MenuItem>
              <MenuItem value={EventRequestStatus.REQUESTED}>Requested</MenuItem>
              <MenuItem value={EventRequestStatus.REJECTED}>Rejected</MenuItem>
              <MenuItem value={EventRequestStatus.SCHEDULED}>Scheduled</MenuItem>
            </Select>
          )}
        />
      </Box>
      <Box>
        <InputLabel htmlFor='filterRole'>Season</InputLabel>
        <Controller
          name='seasonId'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onChange={(event) => field.onChange(event.target.value)}
              input={<OutlinedInput />}
              disabled={!seasons || !seasons.length}
            >
              {seasons?.map((season) => (
                <MenuItem key={season.id} value={season.id}>
                  {season.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: '1rem',
          marginBottom: '0.5rem',
        }}
      >
        <Button type='submit' variant='primary'>
          Filter
        </Button>
        <Button onClick={handleReset} variant='outlined'>
          Reset
        </Button>
      </Box>
    </Box>
  )
}
