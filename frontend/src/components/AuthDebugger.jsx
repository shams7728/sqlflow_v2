import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const AuthDebugger = () => {
  const { user, isAuthenticated, loading, isGuest } = useAuth();
  const [testResults, setTestResults] = useState({});

  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
      const data = await response.json();
      setTestResults(prev => ({ ...prev, backend: { success: true, data } }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, backend: { success: false, error: error.message } }));
    }
  };

  const testCurrentUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      setTestResults(prev => ({ ...prev, currentUser: { success: true, data: userData } }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, currentUser: { success: false, error: error.message } }));
    }
  };

  const testLogin = async () => {
    try {
      const loginData = await api.login('test@example.com', 'password123');
      setTestResults(prev => ({ ...prev, login: { success: true, data: loginData } }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, login: { success: false, error: error.message } }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Auth Debugger</h2>
      
      {/* Current Auth State */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border">
        <h3 className="text-lg font-semibold mb-3">Current Auth State</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>Guest Mode:</strong> {isGuest ? 'Yes' : 'No'}</p>
          <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'None'}</p>
          <p><strong>User Data:</strong></p>
          <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testBackendConnection}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Backend
        </button>
        <button
          onClick={testCurrentUser}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Current User
        </button>
        <button
          onClick={testLogin}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Test Login
        </button>
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        {Object.entries(testResults).map(([test, result]) => (
          <div key={test} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <h4 className="font-semibold mb-2 capitalize">{test} Test Result</h4>
            <div className={`p-2 rounded text-sm ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p><strong>Status:</strong> {result.success ? 'Success' : 'Failed'}</p>
              {result.success ? (
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              ) : (
                <p><strong>Error:</strong> {result.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Environment Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-6 border">
        <h3 className="text-lg font-semibold mb-3">Environment Info</h3>
        <div className="text-sm space-y-1">
          <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL}</p>
          <p><strong>Node ENV:</strong> {process.env.NODE_ENV}</p>
          <p><strong>Current URL:</strong> {window.location.href}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugger;