import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Box, Typography, Slide } from '@mui/material';
import { Star, EmojiEvents, TrendingUp } from '@mui/icons-material';

export function XPNotification({ open, onClose, type, data }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
    }
  }, [open]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const getContent = () => {
    switch (type) {
      case 'xp':
        return {
          icon: <TrendingUp sx={{ color: '#4CAF50' }} />,
          title: `+${data.amount} XP`,
          message: data.reason || 'Great work!',
          color: 'success'
        };
      case 'levelUp':
        return {
          icon: <Star sx={{ color: '#FFD700' }} />,
          title: `Level Up! 🎉`,
          message: `You reached Level ${data.newLevel}!`,
          color: 'warning'
        };
      case 'achievement':
        return {
          icon: <EmojiEvents sx={{ color: '#FF9800' }} />,
          title: 'Achievement Unlocked!',
          message: data.title,
          color: 'info'
        };
      default:
        return {
          icon: <Star />,
          title: 'Progress!',
          message: 'Keep going!',
          color: 'info'
        };
    }
  };

  const content = getContent();

  return (
    <Snackbar
      open={show}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'left' }}
    >
      <Alert
        onClose={handleClose}
        severity={content.color}
        icon={content.icon}
        sx={{
          width: '100%',
          minWidth: 300,
          boxShadow: 3,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {content.title}
          </Typography>
          <Typography variant="body2">
            {content.message}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
}
