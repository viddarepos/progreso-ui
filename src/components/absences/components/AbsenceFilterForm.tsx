import { Box, Button, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import { Controller, useForm } from 'react-hook-form'

import type { AbsencesFilterCriteria } from '../../../features/slice.types'
import { AbsenceStatus, AbsenceType } from '../../../utils/enums'
import { setCapitalizedAbsenceType } from '../../../utils/functions'
import type { Season } from '../../../utils/interfaces'

type Props = {
  seasons: Season[] | null
  onSubmit: (data: AbsencesFilterCriteria) => void
}

export default function AbsenceFilterForm({ seasons, onSubmit }: Props) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      absenceType: '' as AbsenceType,
      seasonId: '',
      status: '' as AbsenceStatus,
    },
  })

  const handleFormSubmit = (formData: AbsencesFilterCriteria) => {
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
      sx={{
        marginInline: 'auto',
        width: {
          desktop: '90vw',
          laptop: '90vw',
          largeScreen: '80vw',
          mobile: '90vw',
          tablet: '90vw',
        },
      }}
    >
      <Box
        component='form'
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          alignItems: 'center',
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: {
            desktop: 'repeat(3,1fr), 1fr',
            tablet: 'repeat(3,1fr)',
          },
          justifyContent: 'center',
          marginBlock: '2rem',
        }}
      >
        <Box
          sx={{
            '& .MuiInputBase-root': {
              width: '100%',
            },
          }}
        >
          <InputLabel htmlFor='filterStatus'>Status</InputLabel>
          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onChange={(event) => field.onChange(event.target.value as AbsenceStatus)}
                input={<OutlinedInput />}
              >
                <MenuItem value={AbsenceStatus.PENDING}>Pending</MenuItem>
                <MenuItem value={AbsenceStatus.APPROVED}>Approved</MenuItem>
                <MenuItem value={AbsenceStatus.REJECTED}>Rejected</MenuItem>
              </Select>
            )}
          />
        </Box>
        <Box
          sx={{
            '& .MuiInputBase-root': {
              width: '100%',
            },
          }}
        >
          <InputLabel htmlFor='filterSeason'>Season</InputLabel>
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
            '& .MuiInputBase-root': {
              width: '100%',
            },
          }}
        >
          <InputLabel htmlFor='filterType'>Absence Type</InputLabel>
          <Controller
            name='absenceType'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onChange={(event) => field.onChange(event.target.value as AbsenceType)}
                input={<OutlinedInput />}
              >
                {Object.values(AbsenceType).map((absenceType) => (
                  <MenuItem key={absenceType} value={absenceType}>
                    {setCapitalizedAbsenceType(absenceType)}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            gridColumn: {
              desktop: '-1',
              laptop: '-1',
              mobile: '1/-1',
              tablet: '1/-1',
            },
            justifySelf: 'center',
            marginTop: {
              laptop: '2rem',
            },
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
    </Box>
  )
}
