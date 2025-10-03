import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const SimpleResponsiveHeader = ({ onMenuToggle, sidebarOpen = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        {/* Hamburger Menu Button (Mobile) */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuToggle}
            sx={{ 
              mr: 2,
              minWidth: 44,
              minHeight: 44
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: 20,
                height: 16,
                '& span': {
                  display: 'block',
                  width: '100%',
                  height: 2,
                  bgcolor: 'currentColor',
                  borderRadius: 1,
                  transition: 'all 0.3s ease',
                  transformOrigin: 'center',
                },
                ...(sidebarOpen && {
                  '& span:nth-of-type(1)': {
                    transform: 'rotate(45deg) translate(5px, 5px)',
                  },
                  '& span:nth-of-type(2)': {
                    opacity: 0,
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
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            SQL-Flow
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SimpleResponsiveHeader;