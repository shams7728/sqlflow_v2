import React, { useEffect, useState } from 'react';
import { useProgressStore } from '../stores/progressStore';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  FireIcon,
  BookOpenIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  details?: any;
}

const ValidationDashboard: React.FC = () => {
  const { 
    progress, 
    stats, 
    achievements, 
    updateLessonProgress, 
    fetchUserProgress, 
    fetchStats, 
    fetchAchievements,
    isLoading 
  } = useProgressStore();
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Data Fetching
    addTestResult({ name: 'Data Fetching', status: 'pending', message: 'Fetching progress data...' });
    try {
      await fetchUserProgress();
      await fetchStats();
      await fetchAchievements();
      addTestResult({ 
        name: 'Data Fetching', 
        status: 'pass', 
        message: 'Successfully fetched all progress data',
        details: { progressRecords: Object.keys(progress).length, achievements: achievements.length }
      });
    } catch (error) {
      addTestResult({ 
        name: 'Data Fetching', 
        status: 'fail', 
        message: `Failed to fetch data: ${error}` 
      });
    }

    // Test 2: Progress Store State
    addTestResult({ name: 'Progress Store State', status: 'pending', message: 'Validating store state...' });
    if (stats) {
      addTestResult({ 
        name: 'Progress Store State', 
        status: 'pass', 
        message: `Stats loaded: ${stats.completedLessons} lessons, ${stats.totalTimeSpent}s time`,
        details: stats
      });
    } else {
      addTestResult({ 
        name: 'Progress Store State', 
        status: 'fail', 
        message: 'Stats not loaded' 
      });
    }

    // Test 3: Achievement System
    addTestResult({ name: 'Achievement System', status: 'pending', message: 'Checking achievements...' });
    if (achievements.length > 0) {
      addTestResult({ 
        name: 'Achievement System', 
        status: 'pass', 
        message: `${achievements.length} achievements found`,
        details: achievements.map(a => ({ title: a.title, points: a.points }))
      });
    } else {
      addTestResult({ 
        name: 'Achievement System', 
        status: 'pass', 
        message: 'No achievements yet (normal for new users)' 
      });
    }

    // Test 4: Progress Update
    addTestResult({ name: 'Progress Update', status: 'pending', message: 'Testing progress update...' });
    try {
      const testLessonId = `validation-test-${Date.now()}`;
      await updateLessonProgress(testLessonId, {
        status: 'completed',
        score: 88,
        timeSpent: 240
      });
      
      // Refresh data to verify
      await fetchUserProgress();
      await fetchStats();
      
      if (progress[testLessonId]) {
        addTestResult({ 
          name: 'Progress Update', 
          status: 'pass', 
          message: `Successfully created and verified progress for ${testLessonId}`,
          details: progress[testLessonId]
        });
      } else {
        addTestResult({ 
          name: 'Progress Update', 
          status: 'fail', 
          message: 'Progress update not reflected in store' 
        });
      }
    } catch (error) {
      addTestResult({ 
        name: 'Progress Update', 
        status: 'fail', 
        message: `Progress update failed: ${error}` 
      });
    }

    // Test 5: Real-time Stats Calculation
    addTestResult({ name: 'Stats Calculation', status: 'pending', message: 'Verifying stats calculation...' });
    const progressCount = Object.keys(progress).length;
    const completedCount = Object.values(progress).filter(p => p.status === 'completed' || p.status === 'mastered').length;
    
    if (stats && stats.completedLessons === completedCount) {
      addTestResult({ 
        name: 'Stats Calculation', 
        status: 'pass', 
        message: `Stats correctly calculated: ${completedCount} completed lessons`,
        details: { expected: completedCount, actual: stats.completedLessons }
      });
    } else {
      addTestResult({ 
        name: 'Stats Calculation', 
        status: 'fail', 
        message: `Stats mismatch: expected ${completedCount}, got ${stats?.completedLessons}` 
      });
    }

    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run tests on mount
    runComprehensiveTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'fail': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'pending': return <ClockIcon className="w-5 h-5 text-yellow-500 animate-spin" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const passedTests = testResults.filter(t => t.status === 'pass').length;
  const failedTests = testResults.filter(t => t.status === 'fail').length;
  const totalTests = testResults.filter(t => t.status !== 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🧪 Progress System Validation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive testing of the progress tracking integration
          </p>
        </div>

        {/* Test Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{passedTests}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tests Passed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{failedTests}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tests Failed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{achievements.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Progress Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BookOpenIcon className="w-5 h-5 mr-2 text-blue-500" />
              Progress Records
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Records:</span>
                <span className="font-medium text-gray-900 dark:text-white">{Object.keys(progress).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats?.completedLessons || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Score:</span>
                <span className="font-medium text-gray-900 dark:text-white">{Math.round(stats?.averageScore || 0)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FireIcon className="w-5 h-5 mr-2 text-orange-500" />
              Activity Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats?.currentStreak || 0} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Time Spent:</span>
                <span className="font-medium text-gray-900 dark:text-white">{Math.round((stats?.totalTimeSpent || 0) / 60)} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Attempts:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats?.totalAttempts || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-2">
              {achievements.length > 0 ? (
                achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{achievement.title}</span>
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">+{achievement.points}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No achievements yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Test Results</h2>
              <button
                onClick={runComprehensiveTests}
                disabled={isRunning}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests Again'}
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  result.status === 'pass' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                  result.status === 'fail' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                  'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                }`}>
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{result.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{result.message}</p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                            View Details
                          </summary>
                          <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {testResults.length === 0 && !isRunning && (
              <div className="text-center py-8">
                <BeakerIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No test results yet. Click "Run Tests Again" to start.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationDashboard;