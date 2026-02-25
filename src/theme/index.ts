import { createTheme, alpha, type PaletteMode } from '@mui/material';

export const getScholarwayTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#818cf8' : '#4f46e5', // Indigo modern
        light: isDark ? '#a5b4fc' : '#818cf8',
        dark: isDark ? '#6366f1' : '#4338ca',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#34d399' : '#10b981', // Emerald
        light: isDark ? '#6ee7b7' : '#34d399',
        dark: isDark ? '#10b981' : '#059669',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#020617' : '#f8fafc', // Slate 950 vs Slate 50
        paper: isDark ? '#0f172a' : '#FFFFFF',   // Slate 900 vs White
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#475569',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontWeight: 800, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            padding: '10px 24px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
              : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
            boxShadow: isDark
              ? '0 8px 20px rgba(79, 70, 229, 0.3)'
              : '0 8px 16px rgba(79, 70, 229, 0.2)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: isDark
              ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
              : '0 10px 25px -12px rgba(0, 0, 0, 0.1)',
            backgroundImage: 'none', // Remove MUI default dark mode overlay
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '& fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderWidth: '1.5px',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? alpha('#020617', 0.8) : alpha('#FFFFFF', 0.8),
            backdropFilter: 'blur(12px)',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            color: isDark ? '#f8fafc' : '#0f172a',
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  });
};

const scholarwayTheme = getScholarwayTheme('light'); // Default
export default scholarwayTheme;
