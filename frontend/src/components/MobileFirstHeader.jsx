import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const MobileFirstHeader = ({ onMenuToggle, sidebarOpen = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigate('/login');
  };



  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.appBar
        }}
      >
        <Toolbar sx={{
          minHeight: { xs: '56px', sm: '64px' },
          px: { xs: 1, sm: 2 },
          justifyContent: 'space-between'
        }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {/* Hamburger Menu (Mobile/Tablet) */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                onClick={onMenuToggle}
                sx={{
                  mr: 2,
                  p: 1.5,
                  minWidth: 48,
                  minHeight: 48,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'scale(1.05)'
                  },
                  '&:active': {
                    transform: 'scale(0.95)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 0,
                    height: 0,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    opacity: 0.1,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.3s ease',
                  },
                  '&:active::before': {
                    width: '100%',
                    height: '100%',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: 22,
                    height: 18,
                    position: 'relative',
                    zIndex: 1,
                    '& span': {
                      display: 'block',
                      width: '100%',
                      height: 3,
                      bgcolor: 'currentColor',
                      borderRadius: 2,
                      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      transformOrigin: 'center',
                    },
                    ...(sidebarOpen && {
                      '& span:nth-of-type(1)': {
                        transform: 'rotate(45deg) translate(6px, 6px)',
                        bgcolor: 'primary.main',
                      },
                      '& span:nth-of-type(2)': {
                        opacity: 0,
                        transform: 'scale(0)',
                      },
                      '& span:nth-of-type(3)': {
                        transform: 'rotate(-45deg) translate(6px, -6px)',
                        bgcolor: 'primary.main',
                      },
                    })
                  }}
                >
                  <Box component="span" />
                  <Box component="span" />
                  <Box component="span" />
                </Box>
              </IconButton>
            )}

            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
                transition: 'opacity 0.2s ease'
              }}
              onClick={() => navigate('/dashboard')}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  letterSpacing: '-0.5px'
                }}
              >
                SQL-Flow
              </Typography>
              {isMobile && sidebarOpen && (
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  animation: 'pulse 2s infinite',
                  ml: 1
                }} />
              )}
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <ThemeToggle size="small" />
            
            {/* Profile Avatar */}
            <IconButton
              onClick={() => setProfileMenuOpen(true)}
              sx={{
                p: 0.5,
                '&:hover': {
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  bgcolor: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>


      </AppBar>

      {/* Profile Menu Drawer */}
      <Drawer
        anchor="right"
        open={profileMenuOpen}
        onClose={() => setProfileMenuOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 320 } }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6">{user?.name || 'User'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <List>
            <ListItem button>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemIcon><DarkModeIcon /></ListItemIcon>
                <ListItemText primary="Theme" />
              </Box>
              <ThemeToggle size="small" showTooltip={false} />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem button onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>


    </>
  );
};

export default MobileFirstHeader;