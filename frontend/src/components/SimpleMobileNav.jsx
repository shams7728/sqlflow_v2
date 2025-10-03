import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import {
  Home as HomeIcon,
  MenuBook as LessonsIcon,
  Psychology as PracticeIcon,
  EmojiEvents as AchievementsIcon,
  School as InterviewIcon
} from '@mui/icons-material';

const SimpleMobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: HomeIcon },
    { label: 'Lessons', path: '/lessons', icon: LessonsIcon },
    { label: 'Practice', path: '/practice', icon: PracticeIcon },
    { label: 'Awards', path: '/achievements', icon: AchievementsIcon },
    { label: 'Interview', path: '/sql-interview-preparation', icon: InterviewIcon }
  ];

  const getCurrentValue = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? navItems.indexOf(currentItem) : 0;
  };

  const handleChange = (event, newValue) => {
    navigate(navItems[newValue].path);
  };

  if (!isMobile) return null;

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000,
      borderTop: `1px solid ${theme.palette.divider}`,
      bgcolor: 'background.paper',
      backdropFilter: 'blur(20px)',
      background: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.1)',
      // Safe area for devices with home indicator
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
        sx={{
          height: 70,
          background: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px 8px',
            minHeight: 48, // Ensure minimum touch target
            transition: 'all 0.2s ease',
            borderRadius: 1,
            margin: '0 2px',
            '&:active': {
              transform: 'scale(0.95)',
            },
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              transform: 'translateY(-2px)',
              '& .MuiBottomNavigationAction-icon': {
                transform: 'scale(1.1)',
              },
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            fontWeight: 500,
            '&.Mui-selected': {
              fontSize: '0.75rem',
              fontWeight: 600,
            },
          },
          '& .MuiBottomNavigationAction-icon': {
            transition: 'transform 0.2s ease',
          },
        }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={<item.icon />}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default SimpleMobileNav;