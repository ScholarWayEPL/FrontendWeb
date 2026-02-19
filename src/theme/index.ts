import { createTheme } from '@mui/material/styles';

// Charte graphique ScholarWay: Bleu / Vert / Gris
const scholarwayTheme = createTheme({
  palette: {
    primary: {
      main: '#1565C0', // Bleu principal
      light: '#42A5F5',
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2E7D32', // Vert principal
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#546E7A',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4, // Uniforme avec les constantes
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 6px 12px rgba(0, 0, 0, 0.1)',
    '0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 10px 20px rgba(0, 0, 0, 0.14)',
    '0px 12px 24px rgba(0, 0, 0, 0.16)',
    '0px 14px 28px rgba(0, 0, 0, 0.18)',
    '0px 16px 32px rgba(0, 0, 0, 0.2)',
    '0px 18px 36px rgba(0, 0, 0, 0.22)',
    '0px 20px 40px rgba(0, 0, 0, 0.24)',
    '0px 22px 44px rgba(0, 0, 0, 0.26)',
    '0px 24px 48px rgba(0, 0, 0, 0.28)',
    '0px 26px 52px rgba(0, 0, 0, 0.3)',
    '0px 28px 56px rgba(0, 0, 0, 0.32)',
    '0px 30px 60px rgba(0, 0, 0, 0.34)',
    '0px 32px 64px rgba(0, 0, 0, 0.36)',
    '0px 34px 68px rgba(0, 0, 0, 0.38)',
    '0px 36px 72px rgba(0, 0, 0, 0.4)',
    '0px 38px 76px rgba(0, 0, 0, 0.42)',
    '0px 40px 80px rgba(0, 0, 0, 0.44)',
    '0px 42px 84px rgba(0, 0, 0, 0.46)',
    '0px 44px 88px rgba(0, 0, 0, 0.48)',
    '0px 46px 92px rgba(0, 0, 0, 0.5)',
    '0px 48px 96px rgba(0, 0, 0, 0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F7FA',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#1A1A2E',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
  },
});

export default scholarwayTheme;
