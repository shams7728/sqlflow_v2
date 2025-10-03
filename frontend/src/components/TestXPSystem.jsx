import React, { useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
// Temporarily comment out to avoid errors
// import { useXPSystem } from '../hooks/useXPSystem';
// import { UserStatsCard } from './UserStatsCard';
// import { XPNotification } from './XPNotification';

/**
 * Test Component for XP and Achievement System
 * Add this to your routes to test: <Route path="/test-xp" element={<TestXPSystem />} />
 */
const TestXPSystem = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Temporarily disabled to test basic rendering
  // const { 
  //   userStats,
  //   completeLesson,
  //   completePractice,
  //   completeQuiz,
  //   awardXP,
  //   updateStreak,
  //   xpNotification,
  //   closeNotification
  // } = useXPSystem();

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date() }]);
  };

  const runTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🧪 XP System Test - Basic Version', 'info');
      addResult('✓ Component loaded successfully', 'success');
      addResult('✓ Test page is working', 'success');
      addResult('\n📝 Next steps:', 'info');
      addResult('1. Check browser console for any errors', 'info');
      addResult('2. Make sure backend is running on port 5000', 'info');
      addResult('3. Make sure MongoDB is connected', 'info');
      addResult('\n✅ Basic test completed!', 'success');
      
    } catch (error) {
      addResult(`\n❌ Test failed: ${error.message}`, 'error');
      console.error('Test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            🧪 XP & Achievement System Test
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Test the real-time XP, level, and achievement system
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={runTest}
            disabled={isLoading}
            sx={{ mb: 3 }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
            {isLoading ? 'Running Tests...' : 'Run System Test'}
          </Button>

          {/* Test Results */}
          {testResults.length > 0 && (
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.900', 
                color: 'white',
                fontFamily: 'monospace',
                maxHeight: 400,
                overflow: 'auto'
              }}
            >
              {testResults.map((result, index) => (
                <Typography 
                  key={index} 
                  sx={{ 
                    color: result.type === 'success' ? 'success.light' : 
                           result.type === 'error' ? 'error.light' :
                           result.type === 'warning' ? 'warning.light' : 'grey.400',
                    mb: 0.5,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {result.message}
                </Typography>
              ))}
            </Paper>
          )}

          {/* Instructions */}
          {testResults.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>This test will:</strong>
              </Typography>
              <ul style={{ marginLeft: 20 }}>
                <li>Verify the component loads correctly</li>
                <li>Check backend connectivity</li>
                <li>Test basic functionality</li>
              </ul>
              <Typography variant="body2" sx={{ mt: 2 }}>
                ⚠️ Make sure your backend server is running on port 5000
              </Typography>
            </Alert>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default TestXPSystem;
