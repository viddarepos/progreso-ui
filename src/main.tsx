import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { store } from './app/store.ts'
import App from './App.tsx'
import theme from './MUItheme/theme.ts'
import { SnackbarWrapper } from './wrappers/SnackbarWrapper.tsx'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/600.css'
import '@fontsource/open-sans/700.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter basename={import.meta.env.VITE_BASE_URL || '/'}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SnackbarWrapper>
            <App />
          </SnackbarWrapper>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
)
