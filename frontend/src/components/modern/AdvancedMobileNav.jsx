import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLessonStore } from '../../stores/lessonStore';

const AdvancedMobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Getting Started']));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { lessons } = useLessonStore();
  const menuRef = useRef(null);

  // Navigation items
  const mainNavItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: '🏠',
      description: 'Overview & progress'
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      path: '/achievements', 
      icon: '🏆',
      description: 'Your accomplishments'
    },
    { 
      id: 'progress', 
      label: 'Progress', 
      path: '/progress', 
      icon: '📊',
      description: 'Track your learning'
    }
  ];

  const resourceItems = [
    { 
      id: 'glossary', 
      label: 'Glossary', 
      path: '/glossary', 
      icon: '📖',
      description: '200+ SQL terms'
    },
    { 
      id: 'interview-prep', 
      label: 'Interview Prep', 
      path: '/sql-interview-preparation', 
      icon: '🎯',
      description: '50+ interview questions'
    }
  ];

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu
  const closeMenu = () => {
    setIsOpen(false);
    setActiveSection('main');
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    closeMenu();
  };

  // Toggle category expansion
  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Group lessons by category
  const lessonsByCategory = lessons.reduce((acc, lesson) => {
    const category = lesson.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lesson);
    return acc;
  }, {});

  // Get lesson progress (mock data for now)
  const getLessonProgress = (lessonId) => {
    // This would come from your progress store
    return Math.random() > 0.5 ? 'completed' : 'not_started';
  };

  // Get category progress
  const getCategoryProgress = (categoryLessons) => {
    const completed = categoryLessons.filter(lesson => getLessonProgress(lesson.id) === 'completed').length;
    return { completed, total: categoryLessons.length };
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        style={{ zIndex: 9999 }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="relative w-6 h-6">
          <span
            className={`absolute block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
              isOpen ? 'rotate-45 top-3' : 'top-1'
            }`}
          />
          <span
            className={`absolute block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 top-3 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
              isOpen ? '-rotate-45 top-3' : 'top-5'
            }`}
          />
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">SQL-Flow</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {user?.isGuest ? 'Guest Mode' : 'Premium Member'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Section Tabs */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveSection('main')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === 'main'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Main
              </button>
              <button
                onClick={() => setActiveSection('lessons')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === 'lessons'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Lessons
              </button>
            </div>
          </div>

          {/* Main Navigation Section */}
          {activeSection === 'main' && (
            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Main Navigation
                </h3>
                <div className="space-y-1">
                  {mainNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full flex items-center space-x-4 p-3 rounded-xl text-left transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.label}</p>
                          <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resources */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Resources
                </h3>
                <div className="space-y-1">
                  {resourceItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full flex items-center space-x-4 p-3 rounded-xl text-left transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.label}</p>
                          <p className={`text-xs ${isActive ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">75%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lessons Section */}
          {activeSection === 'lessons' && (
            <div className="p-4">
              <div className="space-y-4">
                {Object.entries(lessonsByCategory).map(([category, categoryLessons]) => {
                  const isExpanded = expandedCategories.has(category);
                  const progress = getCategoryProgress(categoryLessons);
                  const progressPercentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
                  
                  return (
                    <div key={category} className="space-y-2">
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            progressPercentage === 100 ? 'bg-green-500' : 
                            progressPercentage > 0 ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{category}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {progress.completed}/{progress.total} completed
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Category Lessons */}
                      {isExpanded && (
                        <div className="ml-4 space-y-1 animate-slide-down">
                          {categoryLessons.map((lesson) => {
                            const lessonProgress = getLessonProgress(lesson.id);
                            const isCompleted = lessonProgress === 'completed';
                            const isCurrentLesson = location.pathname === `/lesson/${lesson.id}`;
                            
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleNavigation(`/lesson/${lesson.id}`)}
                                className={`w-full flex items-center space-x-3 p-2.5 rounded-lg text-left transition-all duration-200 group ${
                                  isCurrentLesson
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  {isCompleted ? (
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className={`w-5 h-5 rounded-full border-2 ${
                                      isCurrentLesson ? 'border-white' : 'border-gray-300 dark:border-gray-600'
                                    }`}></div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${
                                    isCurrentLesson ? 'text-white' : 
                                    isCompleted ? 'text-gray-600 dark:text-gray-400' : 
                                    'text-gray-900 dark:text-white'
                                  }`}>
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                      lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                      lesson.difficulty === 'advanced' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                    }`}>
                                      {lesson.difficulty}
                                    </span>
                                    {lesson.estimatedTime && (
                                      <span className={`text-xs ${
                                        isCurrentLesson ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                      }`}>
                                        {lesson.estimatedTime}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvancedMobileNav;