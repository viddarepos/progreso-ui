import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { RoutePaths } from '../../utils/enums'

type Props = {
  hasNavigation?: boolean
}
export default function Logo({ hasNavigation = false }: Props) {
  const navigate = useNavigate()
  const handleClick = () => {
    if (hasNavigation) {
      navigate(RoutePaths.INDEX)
    }
  }
  return (
    <Typography
      variant='h6'
      sx={{
        cursor: 'pointer',
        fontWeight: '600',
        textTransform: 'uppercase',
      }}
      onClick={handleClick}
    >
      Progreso
    </Typography>
  )
}
