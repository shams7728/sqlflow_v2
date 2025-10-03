import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../context/UnifiedThemeContext';

const ThemeToggle = ({ size = 'medium', showTooltip = true }) => {
  const { isDark, toggleTheme } = useTheme();

  const button = (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      size={size}
      sx={{
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'rotate(180deg)',
        },
      }}
    >
      {isDark ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );

  if (showTooltip) {
    return (
      <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default ThemeToggle;