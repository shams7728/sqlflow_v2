import React from 'react';
import { Box } from '@mui/material';
import useResponsive from '../hooks/useResponsive';

const ResponsiveLayout = ({ 
  children, 
  maxWidth = 'lg',
  padding = true,
  mobileBottomPadding = true,
  className = ''
}) => {
  const { isMobile, getPadding } = useResponsive();

  return (
    <Box
      sx={{
        maxWidth: maxWidth === 'full' ? '100%' : `${maxWidth}.breakpoint`,
        mx: 'auto',
        px: padding ? getPadding(1, 2, 3) : 0,
        py: padding ? getPadding(1, 2, 3) : 0,
        pb: mobileBottomPadding && isMobile ? 10 : padding ? getPadding(1, 2, 3) : 0,
        width: '100%',
        overflowX: 'hidden'
      }}
      className={`mobile-container ${className}`}
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
  const { isMobile, isTablet, getSpacing } = useResponsive();

  const getColumns = () => {
    if (isMobile) return cols.xs || 1;
    if (isTablet) return cols.sm || 2;
    return cols.md || 3;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
        gap: getSpacing(spacing.xs || 1, spacing.sm || 2, spacing.md || 3),
        width: '100%'
      }}
      className={`mobile-grid-${getColumns()} ${className}`}
    >
      {children}
    </Box>
  );
};

export const ResponsiveCard = ({ 
  children, 
  padding = true,
  elevation = 1,
  className = ''
}) => {
  const { getPadding } = useResponsive();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: elevation,
        border: '1px solid',
        borderColor: 'divider',
        p: padding ? getPadding(2, 3, 4) : 0,
        width: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: elevation + 2,
          transform: 'translateY(-2px)'
        }
      }}
      className={`mobile-card ${className}`}
    >
      {children}
    </Box>
  );
};

export const ResponsiveText = ({ 
  variant = 'body1',
  children,
  responsive = true,
  className = ''
}) => {
  const { isMobile, getFontSize } = useResponsive();

  const getFontSizeForVariant = () => {
    if (!responsive) return undefined;
    
    switch (variant) {
      case 'h1':
        return getFontSize('1.75rem', '2.25rem', '3rem');
      case 'h2':
        return getFontSize('1.5rem', '1.875rem', '2.25rem');
      case 'h3':
        return getFontSize('1.25rem', '1.5rem', '1.875rem');
      case 'h4':
        return getFontSize('1.125rem', '1.25rem', '1.5rem');
      case 'h5':
        return getFontSize('1rem', '1.125rem', '1.25rem');
      case 'h6':
        return getFontSize('0.875rem', '1rem', '1.125rem');
      case 'body1':
        return getFontSize('0.875rem', '1rem', '1rem');
      case 'body2':
        return getFontSize('0.75rem', '0.875rem', '0.875rem');
      case 'caption':
        return getFontSize('0.625rem', '0.75rem', '0.75rem');
      default:
        return undefined;
    }
  };

  return (
    <Box
      component="span"
      sx={{
        fontSize: getFontSizeForVariant(),
        lineHeight: isMobile ? 1.4 : 1.5
      }}
      className={className}
    >
      {children}
    </Box>
  );
};

export const ResponsiveButton = ({ 
  children,
  fullWidth = false,
  size = 'medium',
  className = '',
  ...props
}) => {
  const { isMobile } = useResponsive();

  return (
    <Box
      component="button"
      sx={{
        minHeight: isMobile ? 48 : size === 'large' ? 48 : 40,
        px: isMobile ? 3 : 2,
        py: isMobile ? 1.5 : 1,
        fontSize: isMobile ? '1rem' : '0.875rem',
        fontWeight: 600,
        borderRadius: 2,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        width: fullWidth || isMobile ? '100%' : 'auto',
        '&:active': {
          transform: 'scale(0.98)'
        }
      }}
      className={`touch-target mobile-button ${className}`}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveLayout;