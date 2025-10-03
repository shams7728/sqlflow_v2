import { createTheme } from '@mui/material/styles';

// Responsive breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

// Responsive typography
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    '@media (max-width:640px)': {
      fontSize: '2rem',
    },
    '@media (max-width:480px)': {
      fontSize: '1.75rem',
    },
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    '@media (max-width:640px)': {
      fontSize: '1.75rem',
    },
    '@media (max-width:480px)': {
      fontSize: '1.5rem',
    },
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
    '@media (max-width:640px)': {
      fontSize: '1.5rem',
    },
    '@media (max-width:480px)': {
      fontSize: '1.25rem',
    },
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    '@media (max-width:640px)': {
      fontSize: '1.25rem',
    },
    '@media (max-width:480px)': {
      fontSize: '1.125rem',
    },
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
    '@media (max-width:640px)': {
      fontSize: '1.125rem',
    },
    '@media (max-width:480px)': {
      fontSize: '1rem',
    },
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
    '@media (max-width:640px)': {
      fontSize: '1rem',
    },
    '@media (max-width:480px)': {
      fontSize: '0.875rem',
    },
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    '@media (max-width:640px)': {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    '@media (max-width:640px)': {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none',
    '@media (max-width:640px)': {
      fontSize: '1rem',
    },
  },
};

// Responsive spacing
const spacing = (factor) => `${0.25 * factor}rem`;

// Component overrides for mobile responsiveness
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        minHeight: 40,
        borderRadius: 8,
        '@media (max-width:640px)': {
          minHeight: 48, // Larger touch targets on mobile
          fontSize: '1rem',
        },
      },
      sizeLarge: {
        minHeight: 48,
        '@media (max-width:640px)': {
          minHeight: 56,
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        '@media (max-width:640px)': {
          minWidth: 48,
          minHeight: 48,
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-root': {
          '@media (max-width:640px)': {
            minHeight: 48,
            fontSize: '1rem', // Prevent zoom on iOS
          },
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        '@media (max-width:640px)': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        '@media (max-width:640px)': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        '@media (max-width:640px)': {
          margin: 16,
          width: 'calc(100% - 32px)',
          maxHeight: 'calc(100% - 32px)',
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        '@media (max-width:768px)': {
          width: '280px',
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        '@media (max-width:640px)': {
          minHeight: 56,
        },
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        '@media (max-width:640px)': {
          minHeight: 56,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        '@media (max-width:640px)': {
          padding: '8px',
          fontSize: '0.75rem',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        '@media (max-width:640px)': {
          fontSize: '0.75rem',
          height: 28,
        },
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        '@media (max-width:640px)': {
          minWidth: 'auto',
          padding: '12px 8px',
          fontSize: '0.875rem',
        },
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        '@media (max-width:640px)': {
          '&:before': {
            display: 'none',
          },
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        '@media (max-width:640px)': {
          minHeight: 56,
          padding: '0 16px',
        },
      },
    },
  },
};

// Create responsive theme
export const createResponsiveTheme = (mode = 'light') => {
  const baseTheme = createTheme({
    breakpoints,
    typography,
    spacing,
    components,
    palette: {
      mode,
      primary: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
      },
      secondary: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
        secondary: mode === 'light' ? '#64748b' : '#94a3b8',
      },
    },
  });

  return baseTheme;
};

// Utility functions for responsive design
export const getResponsiveValue = (theme, values) => {
  return {
    xs: values.xs || values.mobile || values.default,
    sm: values.sm || values.tablet || values.default,
    md: values.md || values.desktop || values.default,
    lg: values.lg || values.desktop || values.default,
    xl: values.xl || values.desktop || values.default,
  };
};

export const getResponsiveSpacing = (theme, mobile = 1, tablet = 2, desktop = 3) => {
  return {
    xs: theme.spacing(mobile),
    sm: theme.spacing(tablet),
    md: theme.spacing(desktop),
  };
};

export const getResponsiveFontSize = (mobile = '0.875rem', tablet = '1rem', desktop = '1.125rem') => {
  return {
    xs: mobile,
    sm: tablet,
    md: desktop,
  };
};

export default createResponsiveTheme;