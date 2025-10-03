import { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { ProgressProvider } from './context/ProgressContext';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import DatabaseStatus from './components/DatabaseStatus';
import AccessibilityProvider from './components/AccessibilityProvider';
import ToastProvider from './components/ToastProvider';
import UnifiedThemeProvider from './context/UnifiedThemeContext';
import { usePerformance } from './hooks/usePerformance';
import { useAnalytics } from './hooks/useAnalytics';

// Lazy load components for better performance
const ProfessionalSidebar = lazy(() => import('./components/modern/ProfessionalSidebar'));
const MobileSidebar = lazy(() => import('./components/modern/MobileSidebar'));
const LessonPage = lazy(() => import('./components/modern/ModernLessonPage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const RegisterPage = lazy(() => import('./components/RegisterPage'));
const Footer = lazy(() => import('./components/Footer'));
const ProgressPage = lazy(() => import('./components/modern/ProgressPage'));
const ProfessionalDashboard = lazy(() => import('./components/modern/ProfessionalDashboard'));
const AchievementsPage = lazy(() => import('./components/modern/AchievementsPage'));
const PracticePage = lazy(() => import('./components/modern/PracticePage'));
const TestProgressIntegration = lazy(() => import('./components/TestProgressIntegration'));
const TestXPSystem = lazy(() => import('./components/TestXPSystem'));
const SimpleXPTest = lazy(() => import('./components/SimpleXPTest'));
const ValidationDashboard = lazy(() => import('./components/ValidationDashboard'));
const ModernGlossaryPage = lazy(() => import('./components/modern/ModernGlossaryPage'));
const ModernInterviewPrepPage = lazy(() => import('./components/modern/ModernInterviewPrepPage'));
const LessonsPage = lazy(() => import('./components/modern/LessonsPage'));
const FeedbackButton = lazy(() => import('./components/FeedbackButton'));
const SimpleMobileNav = lazy(() => import('./components/SimpleMobileNav'));
const MobileFirstHeader = lazy(() => import('./components/MobileFirstHeader'));
const ResponsiveTestPage = lazy(() => import('./components/ResponsiveTestPage'));
const ResponsiveTestComponent = lazy(() => import('./components/ResponsiveTestComponent'));

const ProtectedRoute = () => {
  const { isAuthenticated, loading, isGuest } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  return isAuthenticated || isGuest ? <Outlet /> : <Navigate to="/login" />;
};

// Component that uses Material-UI theme (must be inside ThemeProvider)
const AppContent = () => {
  const [lessons, setLessons] = useState([]);
  const { loading: authLoading, isAuthenticated } = useAuth();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  console.log('App render - isMobile:', isMobile, 'mobileOpen:', mobileOpen);

  // Initialize performance monitoring and analytics
  usePerformance();
  useAnalytics();

  const handleDrawerToggle = () => {
    console.log('Mobile drawer toggle clicked, current state:', mobileOpen);
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchLessons = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/lessons`);
          const data = await response.json();
          setLessons(data);
        } catch (error) {
          console.error('❌ Failed to load lessons:', error);
          // Set empty lessons array as fallback
          setLessons([]);
        }
      };
      fetchLessons();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return <LoadingSpinner fullScreen message="Initializing SQL-Flow..." />;
  }

  const AuthenticatedLayout = () => (
    <ErrorBoundary>
      <ProgressProvider lessons={lessons}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Header */}
          <Suspense fallback={<LoadingSpinner message="Loading header..." />}>
            <MobileFirstHeader
              onMenuToggle={handleDrawerToggle}
              sidebarOpen={mobileOpen}
            />
          </Suspense>

          {/* Main Layout */}
          <Box sx={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
              <Box sx={{
                width: 280,
                flexShrink: 0,
                borderRight: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                height: '100%',
                overflow: 'hidden'
              }}>
                <Suspense fallback={<LoadingSpinner message="Loading sidebar..." />}>
                  <ProfessionalSidebar lessons={lessons} />
                </Suspense>
              </Box>
            )}

            {/* Mobile Sidebar */}
            {isMobile && (
              <Suspense fallback={null}>
                <MobileSidebar
                  lessons={lessons}
                  isOpen={mobileOpen}
                  onClose={handleDrawerToggle}
                />
              </Suspense>
            )}

            {/* Main Content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                width: { xs: '100%', md: `calc(100% - 280px)` },
                minHeight: 0, // Important for proper flex behavior
                position: 'relative'
              }}
            >
              <Box sx={{
                flex: 1,
                p: { xs: 1, sm: 2, md: 3 },
                pb: { xs: 10, sm: 2, md: 3 }, // Extra bottom padding for mobile nav
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.divider,
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: theme.palette.action.hover,
                },
              }}>
                <Suspense fallback={<LoadingSpinner message="Loading content..." />}>
                  <Outlet />
                </Suspense>
              </Box>

              {!isMobile && (
                <Suspense fallback={null}>
                  <Footer />
                </Suspense>
              )}
            </Box>
          </Box>

          {/* Mobile Navigation */}
          <Suspense fallback={null}>
            <SimpleMobileNav />
          </Suspense>

          {/* Feedback Button */}
          <Suspense fallback={null}>
            <FeedbackButton />
          </Suspense>

          {/* Database Status */}
          <DatabaseStatus />
        </Box>
      </ProgressProvider>
    </ErrorBoundary>
  );


  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      <Routes>
        <Route path="/login" element={
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading login..." />}>
            <LoginPage />
          </Suspense>
        } />
        <Route path="/register" element={
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading registration..." />}>
            <RegisterPage />
          </Suspense>
        } />

        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<ProfessionalDashboard lessons={lessons} />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/test" element={<TestProgressIntegration />} />
            <Route path="/test-xp" element={<TestXPSystem />} />
            <Route path="/test-simple" element={<SimpleXPTest />} />
            <Route path="/validate" element={<ValidationDashboard />} />
            <Route path="/lesson/:id" element={<LessonPage lessons={lessons} />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/glossary" element={<ModernGlossaryPage />} />
            <Route path="/sql-interview-preparation" element={<ModernInterviewPrepPage />} />
            <Route path="/responsive-test" element={<ResponsiveTestPage />} />
            <Route path="/responsive-demo" element={<ResponsiveTestComponent />} />
          </Route>
        </Route>
      </Routes>
    </Box>
  );
};

export default function App() {
  return (
    <UnifiedThemeProvider>
      <AccessibilityProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AccessibilityProvider>
    </UnifiedThemeProvider>
  );
}