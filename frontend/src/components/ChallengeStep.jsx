import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Collapse,
  useMediaQuery, useTheme, CircularProgress
} from '@mui/material';

export default function ChallengeStep({ step, onCompleted, completed }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateStep = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input.trim(),
          lessonId: step.lessonId,
          exerciseId: step.stepId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      if (data.valid) {
        onCompleted(step.stepId);
        // Clear input after successful completion
        setTimeout(() => setInput(''), 1000);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        valid: false,
        message: 'Connection error. Please check your network and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      mb: isMobile ? 3 : 4,
      p: isMobile ? 2 : 3,
      border: '1px solid',
      borderColor: completed ? 'success.main' : 'divider',
      borderRadius: 2,
      bgcolor: completed ? 'success.50' : 'background.paper',
      transition: 'all 0.3s ease',
      position: 'relative',
      '&:hover': {
        borderColor: completed ? 'success.main' : 'primary.main',
        boxShadow: completed ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'
      }
    }}>
      {completed && (
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'success.main',
          color: 'white',
          borderRadius: '50%',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem'
        }}>
          ✓
        </Box>
      )}

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontSize: isMobile ? '0.95rem' : '1.1rem',
          fontWeight: 600,
          color: completed ? 'success.dark' : 'text.primary',
          pr: completed ? 4 : 0
        }}
      >
        {step.description}
      </Typography>

      <TextField
        multiline
        fullWidth
        minRows={isMobile ? 2 : 3}
        maxRows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={completed}
        placeholder={completed ? "Challenge completed!" : "Write your SQL here..."}
        sx={{
          mt: 1,
          mb: 2,
          '& .MuiInputBase-root': {
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            fontFamily: 'monospace',
            bgcolor: completed ? 'success.50' : 'background.default'
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main'
            }
          }
        }}
      />

      {!completed && (
        <Button
          variant="contained"
          onClick={validateStep}
          disabled={loading || !input.trim()}
          fullWidth={isMobile}
          sx={{
            py: isMobile ? 1 : 1.25,
            fontSize: isMobile ? '0.9rem' : '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              bgcolor: 'grey.300',
              color: 'grey.500'
            }
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Validating...
            </>
          ) : 'Submit Challenge Step'}
        </Button>
      )}

      <Collapse in={!!result}>
        <Box sx={{
          mt: 2,
          p: 1.5,
          borderRadius: 1,
          bgcolor: result?.valid ? 'success.50' : 'error.50',
          border: '1px solid',
          borderColor: result?.valid ? 'success.main' : 'error.main'
        }}>
          <Typography
            sx={{
              fontSize: isMobile ? '0.9rem' : '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 500
            }}
            color={result?.valid ? 'success.dark' : 'error.dark'}
          >
            {result?.valid ? '🎉' : '❌'} {result?.message}
          </Typography>
          {result?.hint && !result?.valid && (
            <Typography
              sx={{
                mt: 1,
                fontSize: isMobile ? '0.8rem' : '0.85rem',
                fontStyle: 'italic'
              }}
              color="text.secondary"
            >
              💡 Hint: {result.hint}
            </Typography>
          )}
        </Box>
      </Collapse>

      {completed && (
        <Box sx={{
          mt: 2,
          p: 1.5,
          borderRadius: 1,
          bgcolor: 'success.50',
          border: '1px solid',
          borderColor: 'success.main'
        }}>
          <Typography
            sx={{
              fontSize: isMobile ? '0.9rem' : '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 600
            }}
            color="success.dark"
          >
            🏆 Challenge Step Completed!
          </Typography>
        </Box>
      )}
    </Box>
  );
}