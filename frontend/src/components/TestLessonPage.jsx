import React from 'react';

const TestLessonPage = () => {
  const mockLesson = {
    id: 'test-lesson',
    title: 'Test Lesson',
    category: 'Testing',
    difficulty: 'Beginner',
    estimatedTime: '10 min',
    theory: [
      {
        type: 'paragraph',
        text: 'This is a test lesson to verify the fixes work properly.'
      }
    ],
    starterQuery: 'SELECT * FROM users LIMIT 5;'
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Lesson Page</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {mockLesson.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{mockLesson.category}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>⏱️ {mockLesson.estimatedTime}</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs">
                {mockLesson.difficulty}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              📖 Bookmark
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              ✅ Mark Complete
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Lesson Content
        </h3>
        <p className="text-blue-800 dark:text-blue-200">
          {mockLesson.theory[0].text}
        </p>
      </div>
      
      <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          SQL Editor
        </h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
          {mockLesson.starterQuery}
        </div>
        <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Run Query
        </button>
      </div>
    </div>
  );
};

export default TestLessonPage;