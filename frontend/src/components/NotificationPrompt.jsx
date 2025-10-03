import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { 
  Notifications, 
  NotificationsActive, 
  Close 
} from '@mui/icons-material';
import { oneSignalService } from '../services/oneSignalService';

/**
 * Notification Permission Prompt Component
 */
export function NotificationPrompt() {
  const [open, setOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const subscribed = await oneSignalService.isSubscribed();
    setIsSubscribed(subscribed);

    // Show prompt if not subscribed and not dismissed before
    const dismissed = localStorage.getItem('notificationPromptDismissed');
    if (!subscribed && !dismissed) {
      // Show after 5 seconds
      setTimeout(() => setOpen(true), 5000);
    }
  };

  const handleEnable = async () => {
    setLoading(true);
    try {
      await oneSignalService.requestPermission();
      const subscribed = await oneSignalService.isSubscribed();
      setIsSubscribed(subscribed);
      setOpen(false);
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationPromptDismissed', 'true');
    setOpen(false);
  };

  const handleLater = () => {
    setOpen(false);
    // Show again in 24 hours
    setTimeout(() => {
      localStorage.removeItem('notificationPromptDismissed');
    }, 24 * 60 * 60 * 1000);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleLater}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsActive color="primary" />
          <span>Stay Updated!</span>
        </Box>
        <IconButton onClick={handleDismiss} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" paragraph>
          Enable notifications to receive:
        </Typography>

        <Box sx={{ pl: 2, mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            🎯 <strong>Lesson reminders</strong> - Stay on track with your learning
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            🏆 <strong>Achievement unlocks</strong> - Celebrate your progress
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            🔥 <strong>Streak alerts</strong> - Don't break your learning streak
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ⭐ <strong>XP milestones</strong> - Track your level ups
          </Typography>
          <Typography variant="body2">
            📚 <strong>New content</strong> - Be first to know about new lessons
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary">
          You can change this anytime in your settings.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleLater} color="inherit">
          Maybe Later
        </Button>
        <Button 
          onClick={handleEnable} 
          variant="contained" 
          disabled={loading}
          startIcon={<Notifications />}
        >
          {loading ? 'Enabling...' : 'Enable Notifications'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
