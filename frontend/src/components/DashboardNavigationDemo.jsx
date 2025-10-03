import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TestDashboardNavigation from './TestDashboardNavigation';

const DashboardNavigationDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard Navigation Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the lesson navigation functionality from the dashboard
          </p>
        </div>
        
        <TestDashboardNavigation />
        
        <div className="mt-8 text-center">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavigationDemo;