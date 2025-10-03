import React, { useEffect, useState } from 'react';
import { useProgressStore } from '../stores/progressStore';

const TestProgressIntegration: React.FC = () => {
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
  
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string, success: boolean = true) => {
    const prefix = success ? '✅' : '❌';
    setTestResults(prev => [...prev, `${prefix} ${message}`]);
  };

  const runTests = async () => {
    setTestResults(['🧪 Starting Progress Integration Tests...']);
    
    try {
      // Test 1: Fetch initial data
      addResult('Fetching user progress...');
      await fetchUserProgress();
      await fetchStats();
      await fetchAchievements();
      addResult('Successfully fetched initial data');

      // Test 2: Check if we have the test data we created
      if (Object.keys(progress).length > 0) {
        addResult(`Found ${Object.keys(progress).length} lesson progress records`);
      } else {
        addResult('No progress records found (this is normal for new users)', true);
      }

      // Test 3: Check stats
      if (stats) {
        addResult(`Stats loaded: ${stats.completedLessons} lessons completed, ${stats.totalTimeSpent}s total time`);
      } else {
        addResult('No stats available', false);
      }

      // Test 4: Check achievements
      if (achievements.length > 0) {
        addResult(`Found ${achievements.length} achievements`);
        achievements.forEach(ach => {
          addResult(`  - ${ach.title}: ${ach.points} points`);
        });
      } else {
        addResult('No achievements found (normal for new users)', true);
      }

      // Test 5: Test progress update
      addResult('Testing progress update...');
      const testLessonId = 'test-lesson-' + Date.now();
      await updateLessonProgress(testLessonId, {
        status: 'completed',
        score: 95,
        timeSpent: 180
      });
      addResult('Successfully updated lesson progress');

      // Test 6: Verify the update
      await fetchUserProgress();
      await fetchStats();
      if (progress[testLessonId]) {
        addResult(`Verified: Test lesson progress saved with score ${progress[testLessonId].score}`);
      } else {
        addResult('Failed to verify progress update', false);
      }

      addResult('🎉 All tests completed!');

    } catch (error) {
      addResult(`Test failed: ${error}`, false);
    }
  };

  useEffect(() => {
    // Auto-run tests when component mounts
    runTests();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Progress Integration Test Results
      </h2>
      
      <div className="space-y-2 mb-6">
        {testResults.map((result, index) => (
          <div key={index} className="text-sm font-mono text-gray-700 dark:text-gray-300">
            {result}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Progress Records</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Object.keys(progress).length}
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Completed Lessons</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats?.completedLessons || 0}
          </p>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Achievements</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {achievements.length}
          </p>
        </div>
      </div>

      <button
        onClick={runTests}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Run Tests Again
      </button>

      {/* Debug Info */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400">
          Debug Information
        </summary>
        <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded text-xs">
          <div className="mb-2">
            <strong>Progress Store State:</strong>
            <pre className="mt-1 overflow-auto">
              {JSON.stringify({ 
                progressCount: Object.keys(progress).length,
                stats: stats,
                achievementsCount: achievements.length 
              }, null, 2)}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
};

export default TestProgressIntegration;