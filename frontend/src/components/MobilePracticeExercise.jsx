import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Collapse,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMoreIcon,
  ExpandLessIcon,
  PlayArrowIcon,
  CheckCircleIcon,
  ErrorIcon,
  LightbulbIcon,
  CodeIcon
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';

const MobilePracticeExercise = ({ 
  exercise, 
  lessonId, 
  onCompleted, 
  completed = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);
  const [userQuery, setUserQuery] = useState(exercise.starterCode || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lessonId, 
          query: userQuery,
          exerciseId: exercise.id 
        })
      });

      const data = await response.json();
      setResult(data);

      if (data.success && data.correct) {
        onCompleted(exercise.id);
      }
    } catch (error) {
      setResult({ 
        success: false, 
        error: 'Failed to execute query' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = () => {
    switch (exercise.difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        border: completed ? `2px solid ${theme.palette.success.main}` : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: completed ? 'success.light' : 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            {completed && (
              <CheckCircleIcon 
                sx={{ color: 'success.main', fontSize: isMobile ? 20 : 24 }} 
              />
            )}
            <Typography 
              variant={isMobile ? 'subtitle1' : 'h6'}
              sx={{ 
                fontWeight: 600,
                color: completed ? 'success.dark' : 'text.primary',
                flex: 1,
                pr: 1
              }}
            >
              {exercise.title}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {exercise.difficulty && (
              <Chip
                label={exercise.difficulty}
                color={getDifficultyColor()}
                size="small"
                sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
              />
            )}
            <IconButton size="small">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {/* Description */}
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 3,
              lineHeight: 1.6,
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            {exercise.description}
          </Typography>

          {/* Expected Output */}
          {exercise.expectedOutput && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Expected Output:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  fontFamily: 'monospace',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  overflowX: 'auto'
                }}
              >
                <pre>{JSON.stringify(exercise.expectedOutput, null, 2)}</pre>
              </Paper>
            </Box>
          )}

          {/* SQL Editor */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Your SQL Query:
            </Typography>
            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                overflow: 'hidden',
                height: isMobile ? 200 : 250
              }}
            >
              <Editor
                height="100%"
                language="sql"
                value={userQuery}
                onChange={setUserQuery}
                options={{
                  minimap: { enabled: false },
                  fontSize: isMobile ? 12 : 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10, bottom: 10 }
                }}
                theme="vs-light"
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 1, 
            mb: 3 
          }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : <PlayArrowIcon />}
              onClick={handleExecute}
              disabled={loading || !userQuery.trim()}
              sx={{ 
                minHeight: 48,
                flex: isMobile ? 'none' : 1
              }}
            >
              {loading ? 'Executing...' : 'Run Query'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<LightbulbIcon />}
              onClick={() => setShowHint(!showHint)}
              sx={{ minHeight: 48 }}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>

            {exercise.solution && (
              <Button
                variant="outlined"
                startIcon={<CodeIcon />}
                onClick={() => setShowSolution(!showSolution)}
                sx={{ minHeight: 48 }}
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </Button>
            )}
          </Box>

          {/* Hint */}
          <AnimatePresence>
            {showHint && exercise.hint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert 
                  severity="info" 
                  sx={{ mb: 2 }}
                  icon={<LightbulbIcon />}
                >
                  <Typography variant="body2">
                    {exercise.hint}
                  </Typography>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Solution */}
          <AnimatePresence>
            {showSolution && exercise.solution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Solution:
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'grey.900',
                      color: 'common.white',
                      fontFamily: 'monospace',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      overflowX: 'auto'
                    }}
                  >
                    <pre>{exercise.solution}</pre>
                  </Paper>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                severity={result.success ? (result.correct ? 'success' : 'warning') : 'error'}
                sx={{ mb: 2 }}
                icon={result.success ? (result.correct ? <CheckCircleIcon /> : undefined) : <ErrorIcon />}
              >
                <Typography variant="body2">
                  {result.success
                    ? result.correct
                      ? '🎉 Correct! Well done!'
                      : 'Query executed successfully, but the result doesn\'t match the expected output.'
                    : `Error: ${result.error}`
                  }
                </Typography>
              </Alert>

              {result.success && result.data && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Query Result:
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      maxHeight: 200,
                      overflowY: 'auto',
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                  >
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </Paper>
                </Box>
              )}
            </motion.div>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default MobilePracticeExercise;