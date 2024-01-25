import CopyrightIcon from '@mui/icons-material/Copyright'
import { Grid, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Grid
      container
      component='footer'
      sx={{
        alignItems: 'center',
        backgroundColor: 'primary.main',
        bottom: '0',
        color: '#fff',
        justifyContent: 'center',
        padding: '0.3rem',
        position: 'fixed',
        zIndex: '3',
      }}
    >
      <Grid item>
        <CopyrightIcon
          sx={{
            fontSize: '0.7em',
            marginRight: '0.2rem',
          }}
        />
      </Grid>
      <Grid item>
        <Typography variant='caption'>2023 Prime Holding JSC</Typography>
      </Grid>
    </Grid>
  )
}
