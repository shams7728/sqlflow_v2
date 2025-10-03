import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { oneSignalService } from '../services/oneSignalService';

/**
 * OneSignal Initialization Component
 * Add this to your App.js inside the main component
 */
export function OneSignalInit() {
  const { user, isAuthenticated, isGuest } = useAuth();

  useEffect(() => {
    // Initialize OneSignal
    const initOneSignal = async () => {
      try {
        await oneSignalService.initialize();
        
        // Set external user ID if logged in
        if (isAuthenticated && !isGuest && user) {
          const userId = user.id || user._id || user.email;
          await oneSignalService.setExternalUserId(userId);
          
          // Set user tags for segmentation
          await oneSignalService.setTags({
            userId: userId,
            email: user.email,
            name: user.name || 'User',
            isGuest: isGuest ? 'true' : 'false'
          });
        }
      } catch (error) {
        console.error('OneSignal initialization error:', error);
      }
    };

    initOneSignal();

    // Cleanup on logout
    return () => {
      if (!isAuthenticated) {
        oneSignalService.removeExternalUserId();
      }
    };
  }, [user, isAuthenticated, isGuest]);

  // This component doesn't render anything
  return null;
}
