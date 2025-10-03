import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Box,
  Typography,
  Chip,
  Zoom,
  Slide
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Close as CloseIcon,
  Send as SendIcon,
  BugReport as BugIcon,
  Lightbulb as SuggestionIcon,
  Star as FeedbackStarIcon
} from '@mui/icons-material';
import { api } from '../services/api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState('feedback');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Debug: Log when component mounts
  React.useEffect(() => {
    console.log('FeedbackButton component mounted');
  }, []);

  const issueTypes = [
    { value: 'bug', label: 'Bug Report', icon: <BugIcon />, color: 'error' },
    { value: 'suggestion', label: 'Suggestion', icon: <SuggestionIcon />, color: 'warning' },
    { value: 'feedback', label: 'General Feedback', icon: <FeedbackStarIcon />, color: 'success' }
  ];

  const handleOpen = () => {
    console.log('Feedback button clicked!');
    setOpen(true);
    setSuccess(false);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form after closing
    setTimeout(() => {
      setMessage('');
      setEmail('');
      setName('');
      setIssueType('feedback');
      setSuccess(false);
      setError('');
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.submitFeedback({
        name: name || 'Anonymous',
        email: email || 'no-reply@sqlflow.com',
        message,
        issueType
      });

      if (result.success) {
        setSuccess(true);
        setMessage('');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(result.message || 'Failed to send feedback');
      }
    } catch (err) {
      setError(err.message || 'Failed to send feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = issueTypes.find(type => type.value === issueType);

  return (
    <>
      {/* Floating Action Button */}
      <Zoom in timeout={500}>
        <Fab
          color="primary"
          aria-label="feedback"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            zIndex: 9999,  // Increased z-index
            boxShadow: 4,
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: 6
            },
            transition: 'all 0.3s ease'
          }}
        >
          <FeedbackIcon />
        </Fab>
      </Zoom>

      {/* Feedback Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 6
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FeedbackIcon color="primary" />
            <Typography variant="h6" component="span">
              Send Feedback
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✅ Thank you! Your feedback has been sent successfully.
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Issue Type Selection */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={issueType}
                  label="Type"
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  {issueTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        <span>{type.label}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selected Type Chip */}
              {selectedType && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={selectedType.icon}
                    label={selectedType.label}
                    color={selectedType.color}
                    size="small"
                  />
                </Box>
              )}

              {/* Name Field (Optional) */}
              <TextField
                fullWidth
                label="Name (Optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Your name"
              />

              {/* Email Field (Optional) */}
              <TextField
                fullWidth
                label="Email (Optional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="your.email@example.com"
                helperText="We'll only use this to respond to your feedback"
              />

              {/* Message Field (Required) */}
              <TextField
                fullWidth
                required
                label="Message"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  issueType === 'bug' 
                    ? 'Describe the bug you encountered...'
                    : issueType === 'suggestion'
                    ? 'Share your suggestion...'
                    : 'Share your feedback...'
                }
                helperText={`${message.length}/500 characters`}
                inputProps={{ maxLength: 500 }}
              />

              {/* Helper Text */}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                💡 Your feedback helps us improve SQLFlow for everyone!
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="inherit">
            {success ? 'Close' : 'Cancel'}
          </Button>
          {!success && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !message.trim()}
              startIcon={loading ? null : <SendIcon />}
              sx={{ minWidth: 100 }}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
