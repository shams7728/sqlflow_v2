import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const ResponsiveWrapper = ({ children, className = '' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [orientation, setOrientation] = useState('portrait');
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };

    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const getResponsiveProps = () => {
    const baseProps = {
      sx: {
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative'
      }
    };

    if (isMobile) {
      return {
        ...baseProps,
        sx: {
          ...baseProps.sx,
          pb: 10, // Bottom padding for mobile nav
          px: 1,
          py: 1,
          maxWidth: '100vw'
        },
        className: `mobile-responsive ${orientation} ${className}`
      };
    }

    if (isTablet) {
      return {
        ...baseProps,
        sx: {
          ...baseProps.sx,
          px: 2,
          py: 2
        },
        className: `tablet-responsive ${orientation} ${className}`
      };
    }

    return {
      ...baseProps,
      sx: {
        ...baseProps.sx,
        px: 3,
        py: 3
      },
      className: `desktop-responsive ${className}`
    };
  };

  return (
    <Box {...getResponsiveProps()}>
      {children}
    </Box>
  );
};

export const ResponsiveContainer = ({ 
  children, 
  maxWidth = 'lg',
  padding = true,
  className = ''
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        maxWidth: maxWidth === 'full' ? '100%' : theme.breakpoints.values[maxWidth],
        mx: 'auto',
        px: padding ? (isMobile ? 2 : 3) : 0,
        py: padding ? (isMobile ? 1 : 2) : 0,
        width: '100%'
      }}
      className={`responsive-container ${className}`}
    >
      {children}
    </Box>
  );
};

export const ResponsiveGrid = ({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  spacing = { xs: 1, sm: 2, md: 3 },
  className = ''
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const getColumns = () => {
    if (isMobile) return cols.xs || 1;
    if (isTablet) return cols.sm || 2;
    if (isDesktop) return cols.md || 3;
    return cols.lg || 4;
  };

  const getSpacing = () => {
    if (isMobile) return spacing.xs || 1;
    if (isTablet) return spacing.sm || 2;
    return spacing.md || 3;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
        gap: theme.spacing(getSpacing()),
        width: '100%'
      }}
      className={`responsive-grid ${className}`}
    >
      {children}
    </Box>
  );
};

export const ResponsiveCard = ({ 
  children, 
  elevation = 1,
  padding = true,
  className = ''
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: isMobile ? 2 : 3,
        boxShadow: theme.shadows[elevation],
        border: `1px solid ${theme.palette.divider}`,
        p: padding ? (isMobile ? 2 : 3) : 0,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[elevation + 2],
          transform: 'translateY(-2px)'
        }
      }}
      className={`responsive-card ${className}`}
    >
      {children}
    </Box>
  );
};

export default ResponsiveWrapper;