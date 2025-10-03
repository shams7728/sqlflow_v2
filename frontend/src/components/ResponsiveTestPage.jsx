import React from 'react';
import { Box, Typography, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';

const ResponsiveTestPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
        📱 Responsive Design Test
      </Typography>
      
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Current Breakpoint Status:</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ 
              color: isMobile ? 'success.main' : 'text.secondary',
              fontWeight: isMobile ? 'bold' : 'normal'
            }}>
              📱 Mobile (< 600px): {isMobile ? '✅ ACTIVE' : '❌ Inactive'}
            </Typography>
            <Typography sx={{ 
              color: isTablet ? 'success.main' : 'text.secondary',
              fontWeight: isTablet ? 'bold' : 'normal'
            }}>
              📟 Tablet (600px - 900px): {isTablet ? '✅ ACTIVE' : '❌ Inactive'}
            </Typography>
            <Typography sx={{ 
              color: isDesktop ? 'success.main' : 'text.secondary',
              fontWeight: isDesktop ? 'bold' : 'normal'
            }}>
              🖥️ Desktop (> 900px): {isDesktop ? '✅ ACTIVE' : '❌ Inactive'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
            Current Screen Width: {screenWidth}px
          </Typography>
        </CardContent>
      </Card>

      {/* Responsive Grid Test */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Responsive Grid Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Mobile: 1 column | Tablet: 2 columns | Desktop: 3 columns
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)' 
        },
        gap: { xs: 1, sm: 2, md: 3 },
        mb: 4
      }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} sx={{ 
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isMobile ? 'primary.light' : isTablet ? 'secondary.light' : 'success.light'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Card {item}</Typography>
              <Typography variant="body2">
                {isMobile ? 'Mobile View' : isTablet ? 'Tablet View' : 'Desktop View'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Navigation Test */}
      <Typography variant="h5" gutterBottom>
        Navigation Test
      </Typography>
      <Card sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          <strong>Mobile:</strong> Hamburger menu + Bottom navigation
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Desktop:</strong> Permanent sidebar + Top header
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try resizing your browser window to see the navigation change!
        </Typography>
      </Card>

      {/* Responsive Features */}
      <Typography variant="h5" gutterBottom>
        Responsive Features Implemented
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
        <Typography>✅ Mobile-first hamburger menu</Typography>
        <Typography>✅ Bottom navigation on mobile</Typography>
        <Typography>✅ Responsive grid layouts</Typography>
        <Typography>✅ Touch-friendly button sizes (44px+)</Typography>
        <Typography>✅ Adaptive typography scaling</Typography>
        <Typography>✅ Proper sidebar behavior</Typography>
        <Typography>✅ Mobile-optimized spacing</Typography>
      </Box>

      {/* Hamburger Menu Test */}
      <Typography variant="h5" gutterBottom>
        🍔 Hamburger Menu Test
      </Typography>
      <Card sx={{ p: 2, mb: 3, bgcolor: isMobile ? 'success.light' : 'grey.100' }}>
        <Typography variant="h6" gutterBottom>
          {isMobile ? '📱 Mobile View - Hamburger Should Be Visible' : '🖥️ Desktop View - No Hamburger'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions for Mobile:</strong>
        </Typography>
        <Typography variant="body2" component="div">
          1. Look for the hamburger menu (☰) in the top-left of the header<br/>
          2. Click it to open the sidebar<br/>
          3. The lines should animate into an X shape<br/>
          4. Click again to close the sidebar<br/>
          5. The X should animate back to hamburger lines
        </Typography>
        
        {isMobile && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              🔍 If you don't see the hamburger menu, try refreshing the page or check the browser console for errors.
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default ResponsiveTestPage;