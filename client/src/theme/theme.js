import { createTheme } from '@mui/material/styles';

/**
 * Light MUI theme — MUI is used for charts, dialogs, and data cards.
 * Bootstrap handles layout, forms, navbar, and general components.
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4a6fa5',
      light: '#6b8fbf',
      dark: '#2f4f7f',
    },
    secondary: {
      main: '#56b870',
      light: '#78cc8e',
      dark: '#3a9152',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2332',
      secondary: '#5a6a7e',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#22c55e',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #e8ecf0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        }
      }
    }
  }
});

export default theme;
