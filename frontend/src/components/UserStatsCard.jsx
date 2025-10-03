import React from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress } from '@mui/material';
import { Star, TrendingUp, LocalFireDepartment, EmojiEvents, School, Quiz, FitnessCenter } from '@mui/icons-material';
import { xpService } from '../services/xpService';

export function UserStatsCard({ stats }) {
  if (!stats) {
    return null;
  }

  const levelInfo = xpService.calculateLevel(stats.totalXP || 0);

  const statItems = [
    {
      icon: <Star sx={{ color: '#FFD700' }} />,
      label: 'Level',
      value: levelInfo.level,
      color: '#FFD700'
    },
    {
      icon: <TrendingUp sx={{ color: '#4CAF50' }} />,
      label: 'Total XP',
      value: stats.totalXP || 0,
      color: '#4CAF50'
    },
    {
      icon: <LocalFireDepartment sx={{ color: '#FF5722' }} />,
      label: 'Current Streak',
      value: `${stats.currentStreak || 0} days`,
      color: '#FF5722'
    },
    {
      icon: <EmojiEvents sx={{ color: '#FF9800' }} />,
      label: 'Achievements',
      value: stats.achievementsCount || 0,
      color: '#FF9800'
    },
    {
      icon: <School sx={{ color: '#2196F3' }} />,
      label: 'Lessons',
      value: stats.lessonsCompleted || 0,
      color: '#2196F3'
    },
    {
      icon: <Quiz sx={{ color: '#9C27B0' }} />,
      label: 'Quizzes',
      value: stats.quizzesCompleted || 0,
      color: '#9C27B0'
    },
    {
      icon: <FitnessCenter sx={{ color: '#607D8B' }} />,
      label: 'Practice',
      value: stats.practiceCompleted || 0,
      color: '#607D8B'
    },
    {
      icon: <LocalFireDepartment sx={{ color: '#FF9800' }} />,
      label: 'Best Streak',
      value: `${stats.longestStreak || 0} days`,
      color: '#FF9800'
    }
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star sx={{ color: '#FFD700' }} />
          Your Progress
        </Typography>

        {/* Level Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Level {levelInfo.level}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {levelInfo.xpToNextLevel} XP to Level {levelInfo.level + 1}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={levelInfo.progressPercent}
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
                borderRadius: 5
              }
            }}
          />
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2}>
          {statItems.map((item, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2
                  }
                }}
              >
                <Box sx={{ mb: 1 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: item.color }}>
                  {item.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
