import { Box, Typography } from '@mui/material'

type Props = {
  description: string
  handleMouseEnter: () => void
  handleMouseLeave: () => void
}

export default function AbsenceDescriptionPopUp({
  description,
  handleMouseEnter,
  handleMouseLeave,
}: Props) {
  return (
    <Box
      sx={{
        backgroundColor: 'common.white',
        borderRadius: '0.3rem',
        boxShadow:
          '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);',
        height: '6rem',
        left: '22%',
        overflow: 'auto',
        padding: '0.75rem',
        position: 'absolute',
        top: '-40%',
        width: '12rem',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Typography>{description}</Typography>
    </Box>
  )
}
