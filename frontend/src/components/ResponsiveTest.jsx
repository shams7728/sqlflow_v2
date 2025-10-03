import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, Grid } from '@mui/material';

const ResponsiveTest = () => {
  const [screenInfo, setScreenInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: 'portrait',
    deviceType: 'desktop'
  });

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let deviceType = 'desktop';
      if (width < 640) deviceType = 'mobile';
      else if (width < 1024) deviceType = 'tablet';
      
      setScreenInfo({
        width,
        height,
        orientation: width > height ? 'landscape' : 'portrait',
        deviceType
      });
    };

    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);
    
    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
    };
  }, []);

  const getBreakpointInfo = () => {
    const { width } = screenInfo;
    
    if (width < 320) return { name: 'XS', color: 'error', description: 'Extra Small (< 320px)' };
    if (width < 480) return { name: 'SM', color: 'warning', description: 'Small Mobile (320-479px)' };
    if (width < 640) return { name: 'MD', color: 'info', description: 'Large Mobile (480-639px)' };
    if (width < 768) return { name: 'LG', color: 'primary', description: 'Tablet Portrait (640-767px)' };
    if (width < 1024) return { name: 'XL', color: 'secondary', description: 'Tablet Landscape (768-1023px)' };
    return { name: '2XL', color: 'success', description: 'Desktop (1024px+)' };
  };

  const breakpoint = getBreakpointInfo();

  return (
    <Box sx={{ p: 2, position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
      <Card sx={{ minWidth: 200, opacity: 0.9 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="h6" gutterBottom>
            Responsive Debug
          </Typography>
          
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Chip 
                label={`${breakpoint.name} - ${screenInfo.deviceType}`}
                color={breakpoint.color}
                size="small"
                sx={{ mb: 1 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {breakpoint.description}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="caption">
                Width: {screenInfo.width}px
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="caption">
                Height: {screenInfo.height}px
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="caption">
                Orientation: {screenInfo.orientation}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="caption">
                Ratio: {(screenInfo.width / screenInfo.height).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResponsiveTest;