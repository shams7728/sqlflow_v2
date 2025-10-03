import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { oneSignalService } from '../services/oneSignalService';

/**
 * Notification Settings Component
 */
export function NotificationSettings() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const subscribed = await oneSignalService.isSubscribed();
    setIsSubscribed(subscribed);

    if (subscribed) {
      const id = await oneSignalService.getUserId();
      setUserId(id);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isSubscribed) {
        await oneSignalService.unsubscribe();
      } else {
        await oneSignalService.requestPermission();
      }
      await loadStatus();
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    await oneSignalService.sendTestNotification();
    alert('Test notification sent! Check your browser.');
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {isSubscribed ? (
            <Notifications color="primary" fontSize="large" />
          ) : (
            <NotificationsOff color="disabled" fontSize="large" />
          )}
          <Box>
            <Typography variant="h6">
              Push Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isSubscribed ? 'You are receiving notifications' : 'Enable to stay updated'}
            </Typography>
          </Box>
        </Box>

        <Alert 
          severity={isSubscribed ? 'success' : 'info'} 
          icon={isSubscribed ? <CheckCircle /> : <ErrorIcon />}
          sx={{ mb: 3 }}
        >
          {isSubscribed ? (
            <>
              <strong>Notifications Enabled</strong>
              <br />
              You'll receive updates about your learning progress.
            </>
          ) : (
            <>
              <strong>Notifications Disabled</strong>
              <br />
              Enable notifications to get reminders and updates.
            </>
          )}
        </Alert>

        <FormControlLabel
          control={
            <Switch
              checked={isSubscribed}
              onChange={handleToggle}
              disabled={loading}
            />
          }
          label={isSubscribed ? 'Notifications Enabled' : 'Notifications Disabled'}
        />

        {isSubscribed && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" gutterBottom>
              You'll receive notifications for:
            </Typography>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Lesson Reminders"
                  secondary="Daily reminders to continue learning"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Achievement Unlocks"
                  secondary="When you earn new badges"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Streak Alerts"
                  secondary="Don't break your learning streak"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Level Ups"
                  secondary="When you reach a new level"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="New Content"
                  secondary="When new lessons are available"
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleTestNotification}
              >
                Send Test Notification
              </Button>
            </Box>

            {userId && (
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={`Device ID: ${userId.substring(0, 8)}...`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="caption" color="text.secondary">
          You can change these settings anytime. Notifications are sent based on your activity and preferences.
        </Typography>
      </CardContent>
    </Card>
  );
}
