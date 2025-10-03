import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, IconButton } from '@mui/material';
import { Close as CloseIcon, Wifi as WifiIcon, WifiOff as WifiOffIcon } from '@mui/icons-material';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [backendStatus, setBackendStatus] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
      checkBackendStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check backend status on mount
    checkBackendStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackendStatus(data.services?.mongodb === 'connected' ? 'connected' : 'limited');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const getStatusMessage = () => {
    if (!isOnline) {
      return {
        severity: 'error',
        message: 'No internet connection. Some features may not work.',
        icon: <WifiOffIcon />
      };
    }

    switch (backendStatus) {
      case 'connected':
        return null; // Don't show anything when everything is working
      case 'limited':
        return {
          severity: 'warning',
          message: 'Limited functionality - Database unavailable. Core SQL features still work!',
          icon: <WifiIcon />
        };
      case 'offline':
        return {
          severity: 'error',
          message: 'Backend server unavailable. Working in offline mode.',
          icon: <WifiOffIcon />
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusMessage();

  if (!statusInfo && isOnline) {
    return null; // Don't render anything when everything is working
  }

  return (
    <Snackbar
      open={!isOnline || backendStatus !== 'connected'}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }} // Account for header
    >
      <Alert
        severity={statusInfo?.severity || 'info'}
        icon={statusInfo?.icon}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setShowOfflineAlert(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{ minWidth: 300 }}
      >
        {statusInfo?.message || 'Checking connection...'}
      </Alert>
    </Snackbar>
  );
};

export default ConnectionStatus;