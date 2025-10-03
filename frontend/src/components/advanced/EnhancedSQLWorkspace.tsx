import React, { useState, useRef } from 'react';
import {
  PlayIcon,
  BookmarkIcon,
  ClockIcon,
  ChartBarIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface QueryResult {
  columns: string[];
  rows: any[];
  executionTime: number;
  rowCount: number;
  error?: string;
}

interface QueryAnalysis {
  optimizationSuggestions: string[];
  performanceScore: number;
  complexity: 'low' | 'medium' | 'high';
  bestPracticesViolations: string[];
  alternativeApproaches: string[];
}

const EnhancedSQLWorkspace: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [analysis, setAnalysis] = useState<QueryAnalysis | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [, setSavedQueries] = useState<{ name: string, query: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'results' | 'analysis' | 'schema'>('editor');
  const [selectedDatabase, setSelectedDatabase] = useState('ecommerce');

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { updateLessonProgress } = useProgressStore();

  // Sample databases
  const databases = [
    { id: 'ecommerce', name: 'E-commerce Store', description: 'Customer orders and products' },
    { id: 'hr', name: 'HR Management', description: 'Employee and department data' },
    { id: 'finance', name: 'Financial System', description: 'Accounts and transactions' },
    { id: 'social', name: 'Social Media', description: 'Users, posts, and interactions' }
  ];

  // Sample schema for selected database
  const getSchema = (dbId: string) => {
    const schemas = {
      ecommerce: {
        customers: ['customer_id', 'name', 'email', 'registration_date', 'city', 'country'],
        orders: ['order_id', 'customer_id', 'order_date', 'total_amount', 'status'],
        products: ['product_id', 'name', 'category_id', 'price', 'stock_quantity'],
        order_items: ['order_item_id', 'order_id', 'product_id', 'quantity', 'unit_price']
      },
      hr: {
        employees: ['employee_id', 'name', 'email', 'department_id', 'manager_id', 'salary', 'hire_date'],
        departments: ['department_id', 'name', 'budget', 'location'],
        positions: ['position_id', 'title', 'min_salary', 'max_salary']
      }
    };
    return schemas[dbId as keyof typeof schemas] || {};
  };

  const executeQuery = async () => {
    if (!query.trim()) return;

    setIsExecuting(true);
    setActiveTab('results');

    try {
      // Simulate API call to execute query
      const response = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          database: selectedDatabase,
          userId: 'guest'
        })
      });

      const result = await response.json();

      if (result.success) {
        setResults({
          columns: result.columns || [],
          rows: result.data || [],
          executionTime: result.executionTime || Math.random() * 100,
          rowCount: result.data?.length || 0
        });

        // Add to history
        setQueryHistory(prev => [query, ...prev.slice(0, 9)]);

        // Get AI analysis
        await analyzeQuery(query);

        // Track progress
        await updateLessonProgress('sql-workspace-practice', {
          status: 'in_progress',
          timeSpent: 60,
          score: 0
        });

      } else {
        setResults({
          columns: [],
          rows: [],
          executionTime: 0,
          rowCount: 0,
          error: result.error || 'Query execution failed'
        });
      }
    } catch (error) {
      setResults({
        columns: [],
        rows: [],
        executionTime: 0,
        rowCount: 0,
        error: 'Network error: Could not execute query'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const analyzeQuery = async (queryText: string) => {
    try {
      // Simulate AI analysis
      const mockAnalysis: QueryAnalysis = {
        optimizationSuggestions: [
          'Consider adding an index on the customer_id column',
          'Use LIMIT to restrict result set size for better performance'
        ],
        performanceScore: Math.floor(Math.random() * 40) + 60,
        complexity: queryText.toLowerCase().includes('join') ? 'medium' : 'low',
        bestPracticesViolations: [],
        alternativeApproaches: [
          'Consider using a subquery instead of JOIN for this specific case'
        ]
      };

      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  // AI assistance function removed

  const saveQuery = () => {
    const name = prompt('Enter a name for this query:');
    if (name && query.trim()) {
      setSavedQueries(prev => [...prev, { name, query }]);
    }
  };

  const loadQuery = (savedQuery: string) => {
    setQuery(savedQuery);
  };

  const formatQuery = () => {
    // Simple query formatting
    const formatted = query
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',\n       ')
      .replace(/\s+(FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING)\s+/gi, '\n$1 ')
      .trim();
    setQuery(formatted);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Advanced SQL Workspace
            </h1>
            <select
              value={selectedDatabase}
              onChange={(e) => setSelectedDatabase(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {databases.map(db => (
                <option key={db.id} value={db.id}>{db.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {/* AI Hint button removed */}
            <button
              onClick={saveQuery}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
            >
              <BookmarkIcon className="w-4 h-4 inline mr-1" />
              Save
            </button>
            <button
              onClick={formatQuery}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <DocumentTextIcon className="w-4 h-4 inline mr-1" />
              Format
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
          {/* Editor Header */}
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SQL Editor</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={executeQuery}
                  disabled={isExecuting || !query.trim()}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isExecuting ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <PlayIcon className="w-4 h-4" />
                  )}
                  <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 p-4">
            <textarea
              ref={editorRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ minHeight: '300px' }}
            />
          </div>

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Queries</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {queryHistory.slice(0, 5).map((historyQuery, index) => (
                  <button
                    key={index}
                    onClick={() => loadQuery(historyQuery)}
                    className="block w-full text-left text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white truncate p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {historyQuery}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Results & Analysis */}
        <div className="w-1/2 flex flex-col">
          {/* Tabs */}
          <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              {[
                { id: 'results', label: 'Results', icon: ChartBarIcon },
                { id: 'analysis', label: 'Analysis', icon: CpuChipIcon },
                { id: 'schema', label: 'Schema', icon: DocumentTextIcon }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'results' && (
              <div className="p-4">
                {results ? (
                  results.error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        <span className="font-medium">Query Error</span>
                      </div>
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{results.error}</p>
                    </div>
                  ) : (
                    <div>
                      {/* Execution Stats */}
                      <div className="mb-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{results.executionTime.toFixed(2)}ms</span>
                        </span>
                        <span>{results.rowCount} rows returned</span>
                      </div>

                      {/* Results Table */}
                      {results.columns.length > 0 && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                {results.columns.map((column, index) => (
                                  <th key={index} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {column}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                              {results.rows.slice(0, 100).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {results.columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                      {row[column] !== null ? String(row[column]) : <span className="text-gray-400 italic">NULL</span>}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <ChartBarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Execute a query to see results</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="p-4">
                {analysis ? (
                  <div className="space-y-4">
                    {/* Performance Score */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Performance Score</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${analysis.performanceScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {analysis.performanceScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Optimization Suggestions */}
                    {analysis.optimizationSuggestions.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Optimization Suggestions</h3>
                        <ul className="space-y-1">
                          {analysis.optimizationSuggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start space-x-2">
                              <LightBulbIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Alternative Approaches */}
                    {analysis.alternativeApproaches.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Alternative Approaches</h3>
                        <ul className="space-y-1">
                          {analysis.alternativeApproaches.map((approach, index) => (
                            <li key={index} className="text-sm text-green-800 dark:text-green-200">
                              {approach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <CpuChipIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Execute a query to see analysis</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schema' && (
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Database Schema: {databases.find(db => db.id === selectedDatabase)?.name}
                </h3>
                <div className="space-y-4">
                  {Object.entries(getSchema(selectedDatabase)).map(([tableName, columns]) => (
                    <div key={tableName} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{tableName}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {columns.map((column, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                            {column}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistance Panel removed */}
    </div>
  );
};

export default EnhancedSQLWorkspace;