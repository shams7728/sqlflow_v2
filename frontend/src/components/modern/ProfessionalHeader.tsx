import React, { useState, useEffect, useRef } from 'react';
import {
  UserCircleIcon,
  CommandLineIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useUnifiedTheme } from '../../context/UnifiedThemeContext';
import SimpleProfileModal from '../SimpleProfileModal';
import { Lesson } from '../../types';

interface ProfessionalHeaderProps {
  lessons?: Lesson[];
}

const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useUnifiedTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSettings(false);
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg p-2">
                  <img src="/assests/database-table.png" alt="SQL-Flow Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  SQL-Flow
                </h1>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <SunIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              ) : (
                <MoonIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              )}
            </button>

            {/* Settings */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
                title="Settings"
              >
                <Cog6ToothIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Settings Dropdown */}
              {showSettings && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in slide-in-from-top-2 duration-200"
                  role="menu"
                  aria-label="Settings menu"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Preferences
                    </div>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setShowSettings(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      role="menuitem"
                    >
                      <span className="flex items-center space-x-2">
                        {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                        <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
                      </span>
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
                    </button>
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        setShowProfile(true);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      role="menuitem"
                    >
                      <span className="flex items-center space-x-2">
                        <Cog6ToothIcon className="w-4 h-4" />
                        <span>Account Settings</span>
                      </span>
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Learning
                    </div>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      role="menuitem"
                      onClick={() => setShowSettings(false)}
                    >
                      <span className="flex items-center justify-between">
                        <span>Difficulty Level</span>
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Beginner</span>
                      </span>
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      role="menuitem"
                      onClick={() => setShowSettings(false)}
                    >
                      <span className="flex items-center justify-between">
                        <span>Progress Tracking</span>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </span>
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      role="menuitem"
                      onClick={() => setShowSettings(false)}
                    >
                      <span className="flex items-center justify-between">
                        <span>Notifications</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">On</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.isGuest ? 'Guest Mode' : 'Premium Member'}
                </p>
              </div>
              <div className="relative group">
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => setShowProfile(true)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Profile Settings
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {showProfile && (
        <SimpleProfileModal onClose={() => setShowProfile(false)} />
      )}
    </header>
  );
};

export default ProfessionalHeader;