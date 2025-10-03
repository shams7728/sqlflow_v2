import { useMediaQuery, useTheme } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Specific breakpoints
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
  // Utility functions
  const getGridCols = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 3;
    if (isLargeDesktop) return 4;
    return 1;
  };
  
  const getSpacing = (mobile = 1, tablet = 2, desktop = 3) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };
  
  const getFontSize = (mobile = '0.875rem', tablet = '1rem', desktop = '1.125rem') => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };
  
  const getPadding = (mobile = 1, tablet = 2, desktop = 3) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };
  
  return {
    // Boolean flags
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    
    // Utility functions
    getGridCols,
    getSpacing,
    getFontSize,
    getPadding,
    
    // Responsive values
    spacing: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    },
    
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    
    padding: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    },
    
    margin: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    }
  };
};

export default useResponsive;