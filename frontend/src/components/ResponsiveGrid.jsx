import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

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
        width: '100%',
        maxWidth: maxWidth === 'full' ? '100%' : '1200px',
        mx: 'auto',
        px: padding ? (isMobile ? 1 : 3) : 0,
        py: padding ? (isMobile ? 1 : 2) : 0
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

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${cols.xs || 1}, 1fr)`,
          sm: `repeat(${cols.sm || 2}, 1fr)`,
          md: `repeat(${cols.md || 3}, 1fr)`,
          lg: `repeat(${cols.lg || 4}, 1fr)`
        },
        gap: {
          xs: theme.spacing(spacing.xs || 1),
          sm: theme.spacing(spacing.sm || 2),
          md: theme.spacing(spacing.md || 3)
        },
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
        borderRadius: 2,
        boxShadow: theme.shadows[elevation],
        border: `1px