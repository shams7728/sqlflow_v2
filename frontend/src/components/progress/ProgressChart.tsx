import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface ProgressChartProps {
  detailed?: boolean;
}

interface DailyActivity {
  date: string;
  lessonsCompleted: number;
  timeSpent: number; // in minutes
  averageScore: number;
  exercisesSolved: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ detailed = false }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartType, setChartType] = useState<'lessons' | 'time' | 'score'>('lessons');
  const [data, setData] = useState<DailyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate mock data for demonstration
    // In real implementation, this would fetch from API
    const generateMockData = () => {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const mockData: DailyActivity[] = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          lessonsCompleted: Math.floor(Math.random() * 3),
          timeSpent: Math.floor(Math.random() * 120) + 15, // 15-135 minutes
          averageScore: Math.floor(Math.random() * 40) + 60, // 60-100%
          exercisesSolved: Math.floor(Math.random() * 8) + 2
        });
      }
      
      setData(mockData);
      setIsLoading(false);
    };

    setIsLoading(true);
    setTimeout(generateMockData, 500); // Simulate API delay
  }, [timeframe]);

  const getChartData = () => {
    switch (chartType) {
      case 'lessons':
        return data.map(d => d.lessonsCompleted);
      case 'time':
        return data.map(d => d.timeSpent);
      case 'score':
        return data.map(d => d.averageScore);
      default:
        return data.map(d => d.lessonsCompleted);
    }
  };

  const getMaxValue = () => {
    const values = getChartData();
    return Math.max(...values, 1);
  };

  const getChartColor = () => {
    switch (chartType) {
      case 'lessons':
        return 'bg-blue-500';
      case 'time':
        return 'bg-green-500';
      case 'score':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getChartLabel = () => {
    switch (chartType) {
      case 'lessons':
        return 'Lessons Completed';
      case 'time':
        return 'Time Spent (minutes)';
      case 'score':
        return 'Average Score (%)';
      default:
        return 'Lessons Completed';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      {detailed && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Learning Analytics
            </h3>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Chart Type Selector */}
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="lessons">Lessons</option>
              <option value="time">Time Spent</option>
              <option value="score">Average Score</option>
            </select>
            
            {/* Timeframe Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 text-sm rounded ${
                    timeframe === period
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <svg viewBox="0 0 800 300" className="w-full h-64">
          {/* Grid lines */}
          <defs>
            <pattern id="progress-grid" width="100" height="50" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="800" height="300" fill="url(#progress-grid)" />
          
          {/* Y-axis labels */}
          <g className="text-xs fill-current text-gray-500 dark:text-gray-400">
            <text x="30" y="50" textAnchor="end">{Math.round(getMaxValue())}</text>
            <text x="30" y="100" textAnchor="end">{Math.round(getMaxValue() * 0.75)}</text>
            <text x="30" y="150" textAnchor="end">{Math.round(getMaxValue() * 0.5)}</text>
            <text x="30" y="200" textAnchor="end">{Math.round(getMaxValue() * 0.25)}</text>
            <text x="30" y="250" textAnchor="end">0</text>
          </g>
          
          {/* X-axis labels - show every nth label to avoid crowding */}
          <g className="text-xs fill-current text-gray-500 dark:text-gray-400">
            {data.map((day, index) => {
              const showLabel = data.length <= 7 || index % Math.ceil(data.length / 7) === 0;
              if (!showLabel) return null;
              
              const x = 60 + (index * (680 / (data.length - 1)));
              return (
                <text key={day.date} x={x} y="280" textAnchor="middle">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </text>
              );
            })}
          </g>
          
          {/* Line chart */}
          <polyline
            fill="none"
            stroke={chartType === 'lessons' ? '#3B82F6' : chartType === 'time' ? '#10B981' : '#8B5CF6'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((day, index) => {
              const x = 60 + (index * (680 / (data.length - 1)));
              const value = getChartData()[index];
              const y = 250 - ((value / getMaxValue()) * 200);
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points with tooltips */}
          {data.map((day, index) => {
            const x = 60 + (index * (680 / (data.length - 1)));
            const value = getChartData()[index];
            const y = 250 - ((value / getMaxValue()) * 200);
            
            return (
              <g key={day.date}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={chartType === 'lessons' ? '#3B82F6' : chartType === 'time' ? '#10B981' : '#8B5CF6'}
                  className="hover:r-6 transition-all duration-200 cursor-pointer"
                >
                  <title>
                    {new Date(day.date).toLocaleDateString()}
                    {'\n'}{getChartLabel()}: {value}
                    {detailed && `\nLessons: ${day.lessonsCompleted}\nTime: ${day.timeSpent}m\nScore: ${day.averageScore}%`}
                  </title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Summary Stats */}
      {detailed && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Total Lessons
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
              {data.reduce((sum, d) => sum + d.lessonsCompleted, 0)}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">
                Total Time
              </span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
              {Math.round(data.reduce((sum, d) => sum + d.timeSpent, 0) / 60)}h
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Avg Score
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
              {Math.round(data.reduce((sum, d) => sum + d.averageScore, 0) / data.length)}%
            </p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Active Days
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
              {data.filter(d => d.lessonsCompleted > 0 || d.timeSpent > 0).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;