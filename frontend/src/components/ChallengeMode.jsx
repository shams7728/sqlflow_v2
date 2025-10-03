import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ChallengeStep from './ChallengeStep';
import { useProgress } from '../context/ProgressContext';

export default function ChallengeMode({ lesson }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { completedChallenges = {}, completeChallengeStep } = useProgress();

  if (!lesson.challenges || lesson.challenges.length === 0) {
    return (
      <Box sx={{ 
        mt: isMobile ? 4 : 6,
        p: 3,
        textAlign: 'center',
        bgcolor: 'grey.50',
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'grey.300'
      }}>
        <Typography color="text.secondary">
          No challenges available for this lesson yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: isMobile ? 4 : 6 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          fontSize: isMobile ? '1.25rem' : '1.5rem',
          mb: isMobile ? 2 : 3,
          color: 'primary.main'
        }}
      >
        🎯 Challenge Mode
      </Typography>

      {lesson.challenges.map((challenge) => (
        <Box key={challenge.id} sx={{ 
          mt: isMobile ? 3 : 4,
          p: isMobile ? 2 : 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontSize: isMobile ? '1.1rem' : '1.25rem',
              fontWeight: 600,
              color: 'primary.dark',
              mb: 2
            }}
          >
            🎯 {challenge.title}
          </Typography>

          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 2 : 3
          }}>
            {challenge.steps.map((step) => (
              <ChallengeStep
                key={step.stepId}
                step={{ ...step, lessonId: lesson.id }}
                onCompleted={completeChallengeStep}
                completed={!!completedChallenges[step.stepId]}
              />
            ))}
          </Box>


        </Box>
      ))}
    </Box>
  );
}