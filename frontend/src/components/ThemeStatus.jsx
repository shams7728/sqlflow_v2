import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useTheme } from '../context/UnifiedThemeContext';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const ThemeStatus = ({ showDetails = false }) => {
  const { isDark, mode } = useTheme();

  if (!showDetails) {
    return (
      <Chip
        icon={isDark ? <Brightness4 /> : <Brightness7 />}
        label={isDark ? 'Dark Mode' : 'Light Mode'}
        color={isDark ? 'secondary' : 'primary'}
        variant="outlined"
        size="small"
      />
    );
  }

  return (
    <Box sx={{ 
      p: 2, 
      border: 1, 
      borderColor: 'divider', 
      borderRadius: 2,
      bgcolor: 'background.paper'
    }}>
      <Typography variant="h6" gutterBottom>
        Theme Status
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {isDark ? <Brightness4 /> : <Brightness7 />}
        <Typography variant="body1">
          Current Mode: <strong>{isDark ? 'Dark' : 'Light'}</strong>
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary">
        System Preference: {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'}
      </Typography>
      
      <Typography variant="body2" color="text.secondary">
        HTML Class: {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
      </Typography>
    </Box>
  );
};

export default ThemeStatus;