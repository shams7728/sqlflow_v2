import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const MobileMenuTest = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log('Menu toggled:', !isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Mobile Menu Test
      </Typography>
      
      <IconButton 
        onClick={toggleMenu}
        sx={{ 
          border: '1px solid #ccc',
          mb: 2
        }}
      >
        <MenuIcon />
      </IconButton>
      
      <Typography>
        Menu is: {isOpen ? 'OPEN' : 'CLOSED'}
      </Typography>
      
      {isOpen && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100vh',
          bgcolor: 'white',
          boxShadow: 3,
          zIndex: 1300,
          p: 2
        }}>
          <Typography variant="h6">Mobile Menu</Typography>
          <IconButton onClick={toggleMenu}>
            Close
          </IconButton>
        </Box>
      )}
      
      {isOpen && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1200
        }} onClick={toggleMenu} />
      )}
    </Box>
  );
};

export default MobileMenuTest;