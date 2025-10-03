import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import {
  CloseIcon,
  HomeIcon,
  BookOpenIcon,
  TrophyIcon,
  BeakerIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BookmarkIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileSidebar = ({ open, onClose, lessons = [] }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: HomeIcon
    },
    {
      id: 'lessons',
      label: 'Lessons',
      path: '/lessons',
      icon: BookOpenIcon
    },
    {
      id: 'practice',
      label: 'Practice',
      path: '/practice',
      icon: BeakerIcon
    },
    {
      id: 'achievements',
      label: 'Achievements',
      path: '/achievements',
      icon: TrophyIcon
    },
    {
      id: 'progress',
      label: 'Progress',
      path: '/progress',
      icon: ChartBarIcon
    },
    {
      id: 'glossary',
      label: 'Glossary',
      path: '/glossary',
      icon: BookmarkIcon
    },
    {
      id: 'interview',
      label: 'Interview Prep',
      path: '/sql-interview-preparation',
      icon: AcademicCapIcon
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`
        }
      }}
      ModalProps={{
        keepMounted: true // Better open performance on mobile
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/assests/database-table.png" 
              alt="SQL-Flow Logo"
              style={{ height: '32px', marginRight: '12px' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              SQL-Flow
            </Typography>
          </Box>
          <IconButton onClick={onClose} className="touch-target">
            <CloseIcon className="w-5 h-5" />
          </IconButton>
        </Box>

        {/* User Info */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.name || 'Welcome'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {user?.email || 'Guest User'}
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List sx={{ p: 1 }}>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 48,
                      bgcolor: active ? 'primary.main' : 'transparent',
                      color: active ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        bgcolor: active ? 'primary.dark' : 'action.hover'
                      }
                    }}
                    className="touch-target"
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 40,
                      color: active ? 'primary.contrastText' : 'text.secondary'
                    }}>
                      <Icon className="w-5 h-5" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: active ? 600 : 400,
                        fontSize: '0.875rem'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Recent Lessons */}
          {lessons.length > 0 && (
            <>
              <Divider sx={{ mx: 2, my: 1 }} />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Recent Lessons
                </Typography>
              </Box>
              <List sx={{ px: 1 }}>
                {lessons.slice(0, 5).map((lesson) => (
                  <ListItem key={lesson.id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleNavigation(`/lesson/${lesson.id}`)}
                      sx={{
                        borderRadius: 2,
                        minHeight: 40,
                        pl: 3
                      }}
                      className="touch-target"
                    >
                      <ListItemText 
                        primary={lesson.title}
                        primaryTypographyProps={{
                          fontSize: '0.8rem',
                          noWrap: true
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.default'
        }}>
          <ListItemButton
            sx={{ borderRadius: 2, minHeight: 48 }}
            className="touch-target"
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CogIcon className="w-5 h-5" />
            </ListItemIcon>
            <ListItemText 
              primary="Settings"
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileSidebar;