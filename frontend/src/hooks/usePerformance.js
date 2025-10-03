import { useEffect, useCallback } from 'react';

export const usePerformance = () => {
  // Measure page load performance
  const measurePageLoad = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metrics:', {
            pageLoadTime: `${loadTime.toFixed(2)}ms`,
            domContentLoaded: `${domContentLoaded.toFixed(2)}ms`,
            totalLoadTime: `${navigation.loadEventEnd - navigation.fetchStart}ms`
          });
        }
      }
    }
  }, []);

  // Measure component render time
  const measureRender = useCallback((componentName, startTime) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
    
    return renderTime;
  }, []);

  // Monitor memory usage
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = performance.memory;
      const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
      const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Memory Usage: ${usedMB}MB / ${totalMB}MB`);
      }
      
      // Warn if memory usage is high
      if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
        console.warn('High memory usage detected');
      }
    }
  }, []);

  useEffect(() => {
    // Measure initial page load
    measurePageLoad();
    
    // Set up periodic memory monitoring in development
    if (process.env.NODE_ENV === 'development') {
      const memoryInterval = setInterval(checkMemoryUsage, 30000); // Every 30 seconds
      return () => clearInterval(memoryInterval);
    }
  }, [measurePageLoad, checkMemoryUsage]);

  return {
    measureRender,
    checkMemoryUsage,
    measurePageLoad
  };
};

export default usePerformance;