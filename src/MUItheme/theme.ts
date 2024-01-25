import { createTheme } from '@mui/material'
import type { ThemeOptions } from '@mui/material/styles'

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary?: true
    xs?: true
  }
}

declare module '@mui/material/Snackbar' {
  interface SnackbarProps {
    variant?: 'success' | 'error' | 'info'
  }
}

declare module '@mui/material/OutlinedInput' {
  interface OutlinedInputProps {
    variant?: 'wide'
  }
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false
    sm: false
    md: false
    lg: false
    xl: false
    mobile: true
    tablet: true
    laptop: true
    desktop: true
    largeScreen: true
  }
}

export const themeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      desktop: 1024,
      laptop: 770,
      largeScreen: 1200,
      mobile: 0,
      tablet: 570,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '100px',
          padding: '0.875em 1.6em',
        },
      },
      variants: [
        {
          props: {
            variant: 'primary',
          },
          style: {
            '&:disabled': {
              backgroundColor: '#9d9d9d',
              color: '#fff',
            },
            '&:hover': {
              backgroundColor: '#007cb8',
            },
            backgroundColor: '#00a0df',
            color: '#fff',
          },
        },
        {
          props: {
            variant: 'xs',
          },
          style: {
            color: '#00a0df',
            fontSize: '0.8rem',
            padding: '0.3rem 0.5rem',
          },
        },
      ],
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#e32b31',
          textAlign: 'right',
          width: '100%',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '& .MuiFormLabel-asterisk': {
            color: '#e32b31',
          },
          fontSize: '0.875rem',
          marginTop: '10px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          height: '33px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          borderRadius: '3px',
          fontSize: '0.875rem',
          padding: '0.75rem 0.9375rem',
        },
        root: {
          '&:focus': {
            outline: 'none',
          },
          margin: '10px 0',
          padding: 0,
          width: '260px',
        },
      },
      variants: [
        {
          props: {
            variant: 'wide',
          },
          style: {
            width: '100%',
          },
        },
      ],
    },
    MuiSnackbar: {
      variants: [
        {
          props: {
            variant: 'success',
          },
          style: {
            '& .MuiSnackbarContent-root': {
              alignItems: 'center',
              backgroundColor: '#66bb6a',
              color: '#fff',
              display: 'flex',
              paddingBlock: '0.15rem',
            },
          },
        },
        {
          props: {
            variant: 'error',
          },
          style: {
            '& .MuiSnackbarContent-root': {
              alignItems: 'center',
              backgroundColor: ' #e32b31',
              color: '#fff',
              display: 'flex',
              paddingBlock: '0.15rem',
            },
          },
        },
        {
          props: {
            variant: 'info',
          },
          style: {
            '& .MuiSnackbarContent-root': {
              alignItems: 'center',
              backgroundColor: ' #ffc400',
              color: '#313942',
              display: 'flex',
              paddingBlock: '0.15rem',
            },
          },
        },
      ],
    },
    MuiSnackbarContent: {
      styleOverrides: {
        action: { cursor: 'pointer' },
        message: {
          alignItems: 'center',
          display: 'flex',
          gap: '0.5rem',
        },
        root: {
          alignItems: 'center',
          display: 'flex',
        },
      },
    },
  },
  palette: {
    common: {
      black: '#000',
      white: '#ffffff',
    },
    error: {
      dark: '#e32b31',
      main: '#fecbd1',
    },
    grey: {
      400: '#d4dbe1',
      500: '#728499',
      700: '#536170',
    },
    info: {
      main: '#b4e7f9',
    },
    mode: 'light',
    primary: {
      100: '#b4e7f9',
      main: '#00a0df',
    },
    secondary: {
      main: '#313942',
    },
    success: {
      100: '#c8e6c9',
      600: '#43a047',
      main: '#66bb6a',
    },
    warning: {
      100: '#ffedb3',
      main: '#ffc400',
    },
  },
  typography: {
    fontFamily: 'Open Sans, sans-serif',
  },
}

const theme = createTheme(themeOptions)
export default theme
