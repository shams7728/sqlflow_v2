import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import existing components (keeping compatibility)
import { ProgressProvider } from './context/ProgressContext';
import LessonPage from './components/LessonPage';
import { useAuth } from './context/AuthContext';
import GlossaryPage from './components/GlossaryPage';
import SQLInterviewPreparation from './components/SQLInterviewPreparation';
import FeedbackButton from './components/FeedbackButton';

// Import modern components
import ModernLessonPage from './components/modern/ModernLessonPage';

// Import modern authentication components
import ModernLoginPage from './components/auth/ModernLoginPage';
import ModernRegisterPage from './components/auth/ModernRegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';

// Import progress components
import ProgressDashboard from './components/progress/ProgressDashboard';

// Import new professional components
import ProfessionalHeader from './components/modern/ProfessionalHeader';
import ProfessionalSidebar from './components/modern/ProfessionalSidebar';
import ProfessionalDashboard from './components/modern/ProfessionalDashboard';

// Import stores directly
import { useLessonStore } from './stores/lessonStore';
import { useThemeStore } from './stores/themeStore';

// Import theme context
import { UnifiedThemeProvider } from './context/UnifiedThemeContext';

// Import mobile menu
import AdvancedMobileNav from './components/modern/AdvancedMobileNav';

// Import styles - professional.css should be imported after index.css
import './styles/professional.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    },
  },
});

const ProtectedRoute = () => {
  const { isAuthenticated, loading, isGuest } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated || isGuest ? <Outlet /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { lessons, fetchLessons } = useLessonStore();
  const { setTheme } = useThemeStore();



  // Initialize theme on app start
  useEffect(() => {
    setTheme(useThemeStore.getState().theme);
  }, [setTheme]);

  // Fetch lessons when authenticated
  useEffect(() => {
    if (isAuthenticated && lessons.length === 0) {
      fetchLessons();
    }
  }, [isAuthenticated, lessons.length, fetchLessons]);

  const AuthenticatedLayout = () => (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider lessons={lessons}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
          {/* Professional Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <ProfessionalSidebar lessons={lessons} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 lg:min-w-0">
            {/* Professional Header */}
            <ProfessionalHeader
              lessons={lessons}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
              <div className="min-h-full">
                <Outlet />
              </div>
            </main>

            {/* Modern Footer */}
            <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400 space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4">
                  <span>© 2024 SQLFlow</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-center sm:text-left">AI-Powered SQL Learning Platform</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Made with ❤️ for developers</span>
                </div>
              </div>
            </footer>
          </div>

          {/* Feedback Button */}
          <FeedbackButton />

          {/* Advanced Mobile Navigation */}
          <AdvancedMobileNav />
        </div>
      </ProgressProvider>
    </QueryClientProvider>
  );

  return (
    <UnifiedThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/login" element={<ModernLoginPage />} />
          <Route path="/register" element={<ModernRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<ProfessionalDashboard lessons={lessons} />} />
              <Route path="/progress" element={<ProgressDashboard />} />
              <Route path="/lesson/:id" element={<ModernLessonPage lessons={lessons} />} />
              <Route path="/lesson-classic/:id" element={<LessonPage lessons={lessons} />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/sql-interview-preparation" element={<SQLInterviewPreparation />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </UnifiedThemeProvider>
  );
};

export default App;