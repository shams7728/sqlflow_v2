import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayIcon } from '@heroicons/react/24/outline';

const TestDashboardNavigation = () => {
  const navigate = useNavigate();

  const mockLessons = [
    {
      id: 'basic-select',
      title: 'Basic SELECT Statements',
      category: 'Getting Started',
      difficulty: 'Beginner',
      estimatedTime: '15 min'
    },
    {
      id: 'where-clause',
      title: 'WHERE Clause Filtering',
      category: 'Getting Started',
      difficulty: 'Beginner',
      estimatedTime: '20 min'
    },
    {
      id: 'joins-intro',
      title: 'Introduction to JOINs',
      category: 'Intermediate',
      difficulty: 'Intermediate',
      estimatedTime: '25 min'
    }
  ];

  const handleLessonClick = (lessonId) => {
    console.log('Navigating to lesson:', lessonId);
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Dashboard Navigation Test</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Continue Learning</h3>
          <button 
            onClick={() => navigate('/lessons')}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors hover:underline"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {mockLessons.map((lesson, index) => (
            <div 
              key={lesson.id} 
              onClick={() => handleLessonClick(lesson.id)}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group transform hover:scale-[1.02]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLessonClick(lesson.id);
                }
              }}
              aria-label={`Start lesson: ${lesson.title}`}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:shadow-lg transition-shadow">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {lesson.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.category}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                    {lesson.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.estimatedTime}</span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <PlayIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Navigation Test Instructions:</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Click on any lesson card to navigate to that lesson</li>
          <li>• Click "View All" to go to the lessons page</li>
          <li>• Use keyboard navigation (Tab + Enter/Space) for accessibility</li>
          <li>• Check browser console for navigation logs</li>
        </ul>
      </div>
    </div>
  );
};

export default TestDashboardNavigation;