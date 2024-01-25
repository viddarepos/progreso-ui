import { Box, Menu, MenuItem } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

import useThemeBreakpoints from '../../hooks/useThemeBreakpoints'
import { CalendarEventSources } from '../../utils/enums'

type Props = {
  anchor: HTMLElement | null
  onClose: () => void
  filters: CalendarEventSources[]
  setFilters: Dispatch<SetStateAction<CalendarEventSources[]>>
}

export default function CheckboxPanel({ onClose, anchor, filters, setFilters }: Props) {
  const { desktopBreakpoint } = useThemeBreakpoints()
  const menuProps = !desktopBreakpoint && {
    anchorEl: anchor,
    onClose: onClose,
    open: Boolean(anchor),
  }

  const toggleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.currentTarget

    setFilters((prev) => {
      if (prev.includes(name as CalendarEventSources)) {
        return prev.filter((el) => el !== name)
      } else {
        return [...prev, name as CalendarEventSources]
      }
    })
  }
  return (
    <Box
      component={!desktopBreakpoint ? Menu : Box}
      {...menuProps}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MenuItem>
        <FormControlLabel
          control={
            <Checkbox
              name={CalendarEventSources.SCHEDULED_EVENTS}
              checked={filters.includes(CalendarEventSources.SCHEDULED_EVENTS)}
              onChange={toggleFilter}
            />
          }
          label='Events'
        />
      </MenuItem>
      <MenuItem>
        <FormControlLabel
          control={
            <Checkbox
              color='success'
              name={CalendarEventSources.APPROVED_TIME_OFFS}
              checked={filters.includes(CalendarEventSources.APPROVED_TIME_OFFS)}
              onChange={toggleFilter}
            />
          }
          label='Approved time offs'
        />
      </MenuItem>
      <MenuItem>
        <FormControlLabel
          control={
            <Checkbox
              color='success'
              name={CalendarEventSources.APPROVED_SICK_LEAVES}
              checked={filters.includes(CalendarEventSources.APPROVED_SICK_LEAVES)}
              onChange={toggleFilter}
            />
          }
          label='Approved sick leaves'
        />
      </MenuItem>
      <MenuItem>
        <FormControlLabel
          control={
            <Checkbox
              color='warning'
              name={CalendarEventSources.PENDING_TIME_OFFS}
              checked={filters.includes(CalendarEventSources.PENDING_TIME_OFFS)}
              onChange={toggleFilter}
            />
          }
          label='Pending time offs'
        />
      </MenuItem>
      <MenuItem>
        <FormControlLabel
          control={
            <Checkbox
              color='warning'
              name={CalendarEventSources.PENDING_SICK_LEAVES}
              checked={filters.includes(CalendarEventSources.PENDING_SICK_LEAVES)}
              onChange={toggleFilter}
            />
          }
          label='Pending sick leaves'
        />
      </MenuItem>
    </Box>
  )
}
