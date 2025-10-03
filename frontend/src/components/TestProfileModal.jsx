import React, { useState } from 'react';
import UserProfile from './auth/UserProfile';

const TestProfileModal = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile Modal Test</h2>
      
      <button
        onClick={() => setShowProfile(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Open Profile Settings
      </button>

      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}

      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ul className="text-sm space-y-1">
          <li>• Click "Open Profile Settings" to test the modal</li>
          <li>• Check if the modal displays properly (full box, not cut off)</li>
          <li>• Test on different screen sizes</li>
          <li>• Click outside the modal or X button to close</li>
          <li>• Test all tabs: Profile, Security, Preferences</li>
        </ul>
      </div>
    </div>
  );
};

export default TestProfileModal;