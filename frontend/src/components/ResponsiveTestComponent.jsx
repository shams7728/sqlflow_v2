import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  useMediaQuery,
  useTheme,
  Chip,
  Stack
} from '@mui/material';
import {
  PhoneAndroid as MobileIcon,
  Tablet as TabletIcon,
  Computer as DesktopIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const ResponsiveTestComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [testState, setTestState] = useState({
    hamburgerClicks: 0,
    lastInteraction: null
  });

  const handleHamburgerTest = () => {
    setTestState(prev => ({
      ...prev,
      hamburgerClicks: prev.hamburgerClicks + 1,
      lastInteraction: new Date().toLocaleTimeString()
    }));
  };

  const getDeviceType = () => {
    if (isMobile) return { type: 'Mobile', icon: MobileIcon, color: 'primary' };
    if (isTablet) return { type: 'Tablet', icon: TabletIcon, color: 'secondary' };
    if (isDesktop) return { type: 'Desktop', icon: DesktopIcon, color: 'success' };
    return { type: 'Unknown', icon: DesktopIcon, color: 'default' };
  };

  const device = getDeviceType();
  const DeviceIcon = device.icon;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '100%', overflow: 'hidden' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          textAlign: 'center',
          mb: 4
        }}
      >
        Responsive Design Test
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Device Detection Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <DeviceIcon color={device.color} />
                <Typography variant="h6">Current Device</Typography>
              </Stack>
              
              <Chip 
                label={device.type}
                color={device.color}
                size="large"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                Screen breakpoints:
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label="Mobile (< 900px)" 
                  variant={isMobile ? "filled" : "outlined"}
                  color={isMobile ? "primary" : "default"}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  label="Tablet (900-1200px)" 
                  variant={isTablet ? "filled" : "outlined"}
                  color={isTablet ? "secondary" : "default"}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  label="Desktop (> 1200px)" 
                  variant={isDesktop ? "filled" : "outlined"}
                  color={isDesktop ? "success" : "default"}
                  size="small"
                  sx={{ mb: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Hamburger Menu Test Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <MenuIcon />
                <Typography variant="h6">Hamburger Menu Test</Typography>
              </Stack>
              
              <Typography variant="body2" color="text.secondary" mb={2}>
                {isMobile 
                  ? "Hamburger menu should be visible in the header. Try clicking it!"
                  : "Hamburger menu is hidden on desktop. Resize your window to see it."
                }
              </Typography>
              
              <Button 
                variant="outlined" 
                onClick={handleHamburgerTest}
                startIcon={<MenuIcon />}
                fullWidth={isMobile}
                sx={{ mb: 2 }}
              >
                Test Hamburger Click
              </Button>
              
              <Box>
                <Typography variant="caption" display="block">
                  Clicks: {testState.hamburgerClicks}
                </Typography>
                {testState.lastInteraction && (
                  <Typography variant="caption" color="text.secondary">
                    Last interaction: {testState.lastInteraction}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Responsive Layout Test */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Responsive Layout Test
              </Typography>
              
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={item}>
                    <Box
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        p: 2,
                        borderRadius: 1,
                        textAlign: 'center',
                        minHeight: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Item {item}
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Typography variant="caption" display="block" mt={2} color="text.secondary">
                This grid should show different numbers of columns based on screen size:
                Mobile (2 cols) → Tablet (3 cols) → Desktop (4-6 cols)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Touch Target Test */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Touch Target Test
              </Typography>
              
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    minHeight: 48, // Minimum touch target size
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Large Touch Target
                </Button>
                
                <Button 
                  variant="outlined"
                  sx={{ 
                    minHeight: 44,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Standard Touch Target
                </Button>
              </Stack>
              
              <Typography variant="caption" display="block" mt={2} color="text.secondary">
                Touch targets should be at least 44px tall for accessibility
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Responsive Text Test */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Responsive Typography
              </Typography>
              
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                  mb: 1
                }}
              >
                Heading 1
              </Typography>
              
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  mb: 1
                }}
              >
                Heading 2
              </Typography>
              
              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.6
                }}
              >
                This text should scale appropriately across different screen sizes 
                while maintaining good readability and proper line spacing.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instructions */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Testing Instructions
        </Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li>Resize your browser window to test different breakpoints</li>
            <li>On mobile/tablet, check if the hamburger menu appears in the header</li>
            <li>Click the hamburger menu to open/close the sidebar</li>
            <li>Verify that the layout adapts smoothly to different screen sizes</li>
            <li>Check that touch targets are large enough on mobile devices</li>
            <li>Test scrolling behavior and ensure no horizontal overflow</li>
          </ol>
        </Typography>
      </Box>
    </Box>
  );
};

export default ResponsiveTestComponent;