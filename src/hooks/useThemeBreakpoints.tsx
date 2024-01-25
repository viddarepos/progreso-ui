import { useMediaQuery, useTheme } from '@mui/material'

export default function useThemeBreakpoints() {
  const theme = useTheme()
  const mobileBreakpoint = useMediaQuery(theme.breakpoints.up('mobile'))
  const tabletBreakpoint = useMediaQuery(theme.breakpoints.up('tablet'))
  const laptopBreakpoint = useMediaQuery(theme.breakpoints.up('laptop'))
  const desktopBreakpoint = useMediaQuery(theme.breakpoints.up('desktop'))

  return { desktopBreakpoint, laptopBreakpoint, mobileBreakpoint, tabletBreakpoint }
}
