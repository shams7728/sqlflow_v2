import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import { Star, TrendingUp } from '@mui/icons-material';
import { xpService } from '../services/xpService';
import { useAuth } from '../context/AuthContext';

export function XPDisplay({ compact = false }) {
  const { user, isGuest } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (isGuest || !user) {
        // Show default stats for guests
        setStats({
          totalXP: 0,
          level: 1,
          xpToNextLevel: 100,
          progressPercent: 0
        });
        setLoading(false);
        return;
      }

      try {
        const userStats = await xpService.getUserStats(user.id || user._id);
        const levelInfo = xpService.calculateLevel(userStats.totalXP || 0);
        setStats({
          ...userStats,
          ...levelInfo
        });
      } catch (error) {
        console.error('Failed to load XP stats:', error);
        // Fallback to default
        setStats({
          totalXP: 0,
          level: 1,
          xpToNextLevel: 100,
          progressPercent: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, isGuest]);

  if (loading || !stats) {
    return null;
  }

  if (compact) {
    return (
      <Tooltip title={`${stats.currentXP || 0} XP • ${stats.xpToNextLevel || 100} to next level`}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star sx={{ color: '#FFD700', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Level {stats.level}
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box sx={{ 
      p: 2, 
      bgcolor: 'background.paper', 
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star sx={{ color: '#FFD700' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Level {stats.level}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="body2" color="text.secondary">
            {stats.currentXP || 0} XP
          </Typography>
        </Box>
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={stats.progressPercent || 0}
        sx={{ 
          height: 8, 
          borderRadius: 4,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            bgcolor: 'primary.main',
            borderRadius: 4
          }
        }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        {stats.xpToNextLevel || 100} XP to Level {(stats.level || 1) + 1}
      </Typography>
    </Box>
  );
}
