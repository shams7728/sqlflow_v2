import React, { useState, useEffect } from 'react';
import { Alert, Box, Chip, Typography, Button, Collapse } from '@mui/material';
import { 
  CheckCircle as CheckIcon, 
  Warning as WarningIcon, 
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon
} from '@mui/icons-material';

const DatabaseStatus = () => {
  const [status, setStatus] = useState({
    server: 'unknown',
    mongodb: 'unknown',
    lessons: 'unknown',
    sqlExecution: 'unknown'
  });
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.services || {});
        setLastCheck(new Date());
      } else {
        setStatus({
          server: 'error',
          mongodb: 'disconnected',
          lessons: 'error',
          sqlExecution: 'error'
        });
      }
    } catch (error) {
      setStatus({
        server: 'offline',
        mongodb: 'disconnected',
        lessons: 'offline',
        sqlExecution: 'offline'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (serviceStatus) => {
    switch (serviceStatus) {
      case 'running':
      case 'connected':
      case 'available':
        return 'success';
      case 'disconnected':
      case 'limited':
        return 'warning';
      case 'offline':
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (serviceStatus) => {
    switch (serviceStatus) {
      case 'running':
      case 'connected':
      case 'available':
        return <CheckIcon fontSize="small" />;
      case 'disconnected':
      case 'limited':
        return <WarningIcon fontSize="small" />;
      case 'offline':
      case 'error':
        return <ErrorIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getOverallStatus = () => {
    if (status.server === 'offline') {
      return {
        severity: 'error',
        message: 'Backend server is offline. Working in offline mode.',
        description: 'Core SQL learning features are still available, but progress saving and user accounts are disabled.'
      };
    }
    
    if (status.mongodb === 'disconnected') {
      return {
        severity: 'warning',
        message: 'Database unavailable - Limited functionality',
        description: 'You can still access lessons and practice SQL, but progress won\'t be saved and user accounts are disabled.'
      };
    }
    
    if (status.server === 'running' && status.mongodb === 'connected') {
      return {
        severity: 'success',
        message: 'All systems operational',
        description: 'Full functionality available including progress tracking and user accounts.'
      };
    }
    
    return {
      severity: 'info',
      message: 'Checking system status...',
      description: 'Please wait while we verify all services.'
    };
  };

  const overallStatus = getOverallStatus();

  // Don't show if everything is working perfectly
  if (overallStatus.severity === 'success') {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity={overallStatus.severity}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={checkStatus}
            disabled={loading}
            startIcon={<RefreshIcon />}
          >
            {loading ? 'Checking...' : 'Refresh'}
          </Button>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {overallStatus.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {overallStatus.description}
            </Typography>
          </Box>
          
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={
              <ExpandIcon 
                sx={{ 
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            }
          >
            Details
          </Button>
        </Box>
        
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={getStatusIcon(status.server)}
              label={`Server: ${status.server}`}
              color={getStatusColor(status.server)}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={getStatusIcon(status.mongodb)}
              label={`Database: ${status.mongodb}`}
              color={getStatusColor(status.mongodb)}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={getStatusIcon(status.lessons)}
              label={`Lessons: ${status.lessons}`}
              color={getStatusColor(status.lessons)}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={getStatusIcon(status.sqlExecution)}
              label={`SQL Engine: ${status.sqlExecution}`}
              color={getStatusColor(status.sqlExecution)}
              size="small"
              variant="outlined"
            />
          </Box>
          
          {lastCheck && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Last checked: {lastCheck.toLocaleTimeString()}
            </Typography>
          )}
        </Collapse>
      </Alert>
    </Box>
  );
};

export default DatabaseStatus;