import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Simple analytics hook for tracking user interactions
export const useAnalytics = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  const trackPageView = useCallback((path) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Page View:', path);
    }
    
    // In production, you would send this to your analytics service
    // Example: gtag('config', 'GA_MEASUREMENT_ID', { page_path: path });
    
    // Store in localStorage for demo purposes
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
    pageViews[path] = (pageViews[path] || 0) + 1;
    pageViews.lastVisit = new Date().toISOString();
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
  }, []);

  const trackEvent = useCallback((eventName, properties = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event:', eventName, properties);
    }

    // In production, send to analytics service
    // Example: gtag('event', eventName, properties);
    
    // Store events for demo
    const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    events.push({
      name: eventName,
      properties,
      timestamp: new Date().toISOString(),
      path: location.pathname
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('analyticsEvents', JSON.stringify(events));
  }, [location.pathname]);

  const trackLessonProgress = useCallback((lessonId, action, progress = 0) => {
    trackEvent('lesson_progress', {
      lessonId,
      action, // 'started', 'completed', 'exercise_completed'
      progress,
      category: 'learning'
    });
  }, [trackEvent]);

  const trackUserAction = useCallback((action, context = {}) => {
    trackEvent('user_action', {
      action,
      ...context,
      category: 'interaction'
    });
  }, [trackEvent]);

  const trackError = useCallback((error, context = {}) => {
    trackEvent('error', {
      message: error.message,
      stack: error.stack,
      ...context,
      category: 'error'
    });
  }, [trackEvent]);

  const trackPerformance = useCallback((metric, value, context = {}) => {
    trackEvent('performance', {
      metric,
      value,
      ...context,
      category: 'performance'
    });
  }, [trackEvent]);

  const getAnalyticsData = useCallback(() => {
    return {
      pageViews: JSON.parse(localStorage.getItem('pageViews') || '{}'),
      events: JSON.parse(localStorage.getItem('analyticsEvents') || '[]'),
      sessionStart: sessionStorage.getItem('sessionStart') || new Date().toISOString()
    };
  }, []);

  // Initialize session
  useEffect(() => {
    if (!sessionStorage.getItem('sessionStart')) {
      sessionStorage.setItem('sessionStart', new Date().toISOString());
      trackEvent('session_start', {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }
  }, [trackEvent]);

  return {
    trackPageView,
    trackEvent,
    trackLessonProgress,
    trackUserAction,
    trackError,
    trackPerformance,
    getAnalyticsData
  };
};

export default useAnalytics;