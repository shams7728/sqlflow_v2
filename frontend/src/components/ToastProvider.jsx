import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Slide, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      severity: options.severity || 'info',
      duration: options.duration || 6000,
      action: options.action,
      ...options
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, options) => {
    return addToast(message, { ...options, severity: 'success' });
  }, [addToast]);

  const showError = useCallback((message, options) => {
    return addToast(message, { ...options, severity: 'error', duration: 8000 });
  }, [addToast]);

  const showWarning = useCallback((message, options) => {
    return addToast(message, { ...options, severity: 'warning' });
  }, [addToast]);

  const showInfo = useCallback((message, options) => {
    return addToast(message, { ...options, severity: 'info' });
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Render toasts */}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          onClose={() => removeToast(toast.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            bottom: { xs: 80, sm: 24 }, // Account for mobile nav
            transform: `translateY(${-index * 70}px)` // Stack toasts
          }}
        >
          <Alert
            severity={toast.severity}
            onClose={() => removeToast(toast.id)}
            action={
              toast.action || (
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => removeToast(toast.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )
            }
            sx={{
              minWidth: 300,
              maxWidth: 500,
              '& .MuiAlert-message': {
                wordBreak: 'break-word'
              }
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider;