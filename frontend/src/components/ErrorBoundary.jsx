import React from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { RefreshCcw, AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    // Example: Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
      />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    resetError();
    window.location.reload();
  };

  const handleGoHome = () => {
    resetError();
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <Box sx={{ mb: 3 }}>
          <AlertTriangle 
            size={64} 
            color="#f44336" 
            style={{ marginBottom: '16px' }}
          />
          
          <Typography variant="h4" component="h1" gutterBottom color="error">
            Oops! Something went wrong
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're sorry, but something unexpected happened. Don't worry, your progress is safe!
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body2" component="div">
            <strong>Error Details:</strong>
            <br />
            {error?.message || 'An unexpected error occurred'}
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<RefreshCcw size={20} />}
            onClick={handleRefresh}
            sx={{ minWidth: 140 }}
          >
            Refresh Page
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Home size={20} />}
            onClick={handleGoHome}
            sx={{ minWidth: 140 }}
          >
            Go to Dashboard
          </Button>
        </Box>

        {process.env.NODE_ENV === 'development' && error && (
          <Box sx={{ mt: 3, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              Development Info:
            </Typography>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'grey.100',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: 200
              }}
            >
              <pre>{error.stack}</pre>
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ErrorBoundary;