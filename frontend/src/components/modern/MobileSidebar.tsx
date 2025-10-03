import React from 'react';
import { 
  HomeIcon,
  BookOpenIcon,
  BeakerIcon,
  TrophyIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolidIcon,
  BookOpenIcon as BookSolidIcon,
  BeakerIcon as BeakerSolidIcon,
  TrophyIcon as TrophySolidIcon,
  ChartBarIcon as ChartSolidIcon,
  QuestionMarkCircleIcon as QuestionSolidIcon,
  AcademicCapIcon as AcademicSolidIcon
} from '@heroicons/react/24/solid';
import { useLocation, useNavigate } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: string;
}

interface MobileSidebarProps {
  lessons: Lesson[];
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ lessons, isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('MobileSidebar render - isOpen:', isOpen, 'lessons count:', lessons.length);

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: HomeIcon, 
      activeIcon: HomeSolidIcon,
      color: 'text-blue-600'
    },
    { 
      id: 'lessons', 
      label: 'Lessons', 
      path: '/lessons', 
      icon: BookOpenIcon, 
      activeIcon: BookSolidIcon,
      color: 'text-green-600'
    },
    { 
      id: 'practice', 
      label: 'Practice', 
      path: '/practice', 
      icon: BeakerIcon, 
      activeIcon: BeakerSolidIcon,
      color: 'text-purple-600'
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      path: '/achievements', 
      icon: TrophyIcon, 
      activeIcon: TrophySolidIcon,
      color: 'text-yellow-600'
    },
    { 
      id: 'progress', 
      label: 'Progress', 
      path: '/progress', 
      icon: ChartBarIcon, 
      activeIcon: ChartSolidIcon,
      color: 'text-indigo-600'
    },
    { 
      id: 'glossary', 
      label: 'Glossary', 
      path: '/glossary', 
      icon: QuestionMarkCircleIcon, 
      activeIcon: QuestionSolidIcon,
      color: 'text-cyan-600'
    },
    { 
      id: 'interview-prep', 
      label: 'Interview Prep', 
      path: '/sql-interview-preparation', 
      icon: AcademicCapIcon, 
      activeIcon: AcademicSolidIcon,
      color: 'text-orange-600'
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto" style={{ zIndex: 9999 }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">SQL-Flow</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = isActive ? item.activeIcon : item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? item.color : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Recent Lessons */}
          {lessons.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Recent Lessons
              </h3>
              <div className="space-y-2">
                {lessons.slice(0, 5).map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleNavigation(`/lesson/${lesson.id}`)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {lesson.category} • {lesson.difficulty}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;