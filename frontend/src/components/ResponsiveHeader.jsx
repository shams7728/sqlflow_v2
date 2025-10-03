import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  useMediaQuery, 
  useTheme,
  Tooltip
} from '@mui/material';
import {
  MenuIcon,
  AccountCircleIcon,
  LogoutIcon,
  SettingsIcon
} from '@mui/icons-material';
import { ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ResponsiveHeader = ({ onMenuToggle, showMenuButton = true, sidebarOpen = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
    navigate('/login');
  };





  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.appBar
      }}
    >
      <Toolbar sx={{ 
        minHeight: { xs: '56px', sm: '64px' },
        px: { xs: 1, sm: 2 }
      }}>
        {/* Hamburger Menu Button (Mobile/Tablet) */}
        {showMenuButton && (isMobile || isTablet) && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label={sidebarOpen ? "close menu" : "open menu"}
            onClick={onMenuToggle}
            sx={{ 
              mr: 2,
              minWidth: 44,
              minHeight: 44,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'scale(1.1)'
              },
              '&:active': {
                transform: 'scale(0.95)'
              }
            }}
            className="touch-target"
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: 20,
                height: 16,
                cursor: 'pointer',
                '& span': {
                  display: 'block',
                  width: '100%',
                  height: 2,
                  bgcolor: 'currentColor',
                  borderRadius: 1,
                  transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  transformOrigin: 'center',
                },
                ...(sidebarOpen && {
                  '& span:nth-of-type(1)': {
                    transform: 'rotate(45deg) translate(5px, 5px)',
                  },
                  '& span:nth-of-type(2)': {
                    opacity: 0,
                    transform: 'scale(0)',
                  },
                  '& span:nth-of-type(3)': {
                    transform: 'rotate(-45deg) translate(7px, -6px)',
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

        {/* Logo/Title */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
          onClick={() => navigate('/dashboard')}
        >
          <img 
            src="/assests/database-table.png" 
            alt="SQL-Flow Logo"
            style={{
              height: isMobile ? '32px' : '40px',
              marginRight: isMobile ? '8px' : '12px',
              transition: 'all 0.2s ease'
            }}
          />
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              transition: 'all 0.3s ease'
            }}
          >
            SQL-Flow
          </Typography>
        </Box>



        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>

          {/* Profile Menu */}
          <Tooltip title="Profile menu">
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
              className="touch-target"
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: { xs: 32, sm: 36 }, 
                  height: { xs: 32, sm: 36 },
                  bgcolor: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: theme.shadows[8]
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={user?.name || 'User'} 
                secondary={user?.email}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </MenuItem>
            
            <Divider />
            

            
            <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveHeader;