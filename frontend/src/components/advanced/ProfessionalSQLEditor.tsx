import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlayIcon,
    ClockIcon,
    DocumentDuplicateIcon,
    ArrowDownTrayIcon,
    CodeBracketIcon,
    TableCellsIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface QueryResult {
    success: boolean;
    data?: any[];
    columns?: string[];
    error?: string;
    executionTime?: number;
    rowCount?: number;
}

interface QueryHistory {
    query: string;
    timestamp: Date;
    executionTime: number;
    success: boolean;
    rowCount?: number;
}

interface ProfessionalSQLEditorProps {
    lessonId: string;
    initialQuery?: string;
    onQueryExecute?: (result: QueryResult) => void;
    readOnly?: boolean;
}

// SQL Keywords for syntax highlighting (moved outside component to prevent recreation)
const SQL_KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
    'ON', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'ORDER', 'BY',
    'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'COUNT',
    'SUM', 'AVG', 'MAX', 'MIN', 'INSERT', 'UPDATE', 'DELETE', 'CREATE',
    'ALTER', 'DROP', 'TABLE', 'DATABASE', 'INDEX', 'VIEW', 'UNION'
];

const ProfessionalSQLEditor: React.FC<ProfessionalSQLEditorProps> = ({
    lessonId,
    initialQuery = '',
    onQueryExecute,
    readOnly = false
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [result, setResult] = useState<QueryResult | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [history, setHistory] = useState<QueryHistory[]>([]);
    const [activeResultTab, setActiveResultTab] = useState<'results' | 'history' | 'explain'>('results');
    const [showShortcuts, setShowShortcuts] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Execute query
    const executeQuery = useCallback(async () => {
        if (!query.trim() || isExecuting) return;

        setIsExecuting(true);
        const startTime = Date.now();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, query: query.trim() })
            });

            const data = await response.json();
            const executionTime = Date.now() - startTime;

            const queryResult: QueryResult = {
                success: data.success,
                data: data.data || [],
                columns: data.columns || [],
                error: data.error,
                executionTime,
                rowCount: data.data?.length || 0
            };

            setResult(queryResult);

            // Add to history
            setHistory(prev => [{
                query: query.trim(),
                timestamp: new Date(),
                executionTime,
                success: data.success,
                rowCount: data.data?.length
            }, ...prev.slice(0, 9)]); // Keep last 10

            if (onQueryExecute) {
                onQueryExecute(queryResult);
            }
        } catch (error) {
            setResult({
                success: false,
                error: 'Failed to execute query. Please check your connection.',
                executionTime: Date.now() - startTime
            });
        } finally {
            setIsExecuting(false);
        }
    }, [query, isExecuting, lessonId, onQueryExecute]);

    // Format query (basic formatting)
    const formatQuery = useCallback(() => {
        let formatted = query.trim();

        // Add newlines before major keywords
        SQL_KEYWORDS.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            formatted = formatted.replace(regex, `\n${keyword.toUpperCase()}`);
        });

        // Clean up extra newlines
        formatted = formatted.replace(/\n+/g, '\n').trim();

        setQuery(formatted);
    }, [query]);

    // Copy query to clipboard
    const copyQuery = () => {
        navigator.clipboard.writeText(query);
    };

    // Export results as CSV
    const exportResults = () => {
        if (!result?.data || result.data.length === 0) return;

        const csv = [
            result.columns?.join(','),
            ...result.data.map(row =>
                result.columns?.map(col => JSON.stringify(row[col] ?? '')).join(',')
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `query-results-${Date.now()}.csv`;
        a.click();
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Enter to execute
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                executeQuery();
            }
            // Ctrl/Cmd + / to show shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                setShowShortcuts(!showShortcuts);
            }
            // Ctrl/Cmd + Shift + F to format
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                formatQuery();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [executeQuery, formatQuery, query, showShortcuts]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={executeQuery}
                        disabled={isExecuting || !query.trim() || readOnly}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isExecuting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Executing...</span>
                            </>
                        ) : (
                            <>
                                <PlayIcon className="w-4 h-4" />
                                <span>Run Query</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={formatQuery}
                        disabled={readOnly}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Format Query (Ctrl+Shift+F)"
                    >
                        <CodeBracketIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Format</span>
                    </button>

                    <button
                        onClick={copyQuery}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Copy Query"
                    >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy</span>
                    </button>

                    <button
                        onClick={() => setQuery('')}
                        disabled={readOnly}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Clear"
                    >
                        <XMarkIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    {result && (
                        <div className="flex items-center space-x-3 text-sm">
                            {result.success ? (
                                <>
                                    <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        <span>{result.rowCount} rows</span>
                                    </span>
                                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>{result.executionTime}ms</span>
                                    </span>
                                </>
                            ) : (
                                <span className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                    <span>Error</span>
                                </span>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => setShowShortcuts(!showShortcuts)}
                        className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        title="Keyboard Shortcuts (Ctrl+/)"
                    >
                        <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">?</kbd>
                    </button>
                </div>
            </div>

            {/* Query Editor */}
            <div className="flex-1 p-4">
                <div className="h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    <textarea
                        ref={textareaRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="-- Write your SQL query here...
-- Press Ctrl+Enter to execute
-- Press Ctrl+Shift+F to format"
                        disabled={readOnly}
                        className="w-full h-full p-4 bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none placeholder-gray-600"
                        style={{
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            lineHeight: '1.6'
                        }}
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Results Section */}
            <div className="h-96 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                {/* Result Tabs */}
                <div className="flex items-center space-x-1 px-4 pt-3 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveResultTab('results')}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeResultTab === 'results'
                            ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 border-t-2 border-primary-600'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <div className="flex items-center space-x-2">
                            <TableCellsIcon className="w-4 h-4" />
                            <span>Results</span>
                            {result?.rowCount !== undefined && (
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                    {result.rowCount}
                                </span>
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveResultTab('history')}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeResultTab === 'history'
                            ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 border-t-2 border-primary-600'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <div className="flex items-center space-x-2">
                            <ClockIcon className="w-4 h-4" />
                            <span>History</span>
                            {history.length > 0 && (
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                    {history.length}
                                </span>
                            )}
                        </div>
                    </button>

                    {result?.data && result.data.length > 0 && (
                        <button
                            onClick={exportResults}
                            className="ml-auto flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            <span>Export CSV</span>
                        </button>
                    )}
                </div>

                {/* Result Content */}
                <div className="h-full overflow-auto p-4">
                    {activeResultTab === 'results' && (
                        <div>
                            {!result ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                    <TableCellsIcon className="w-12 h-12 mb-3 opacity-50" />
                                    <p>Execute a query to see results</p>
                                </div>
                            ) : result.error ? (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <div className="flex items-start space-x-3">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">Query Error</h4>
                                            <p className="text-sm text-red-800 dark:text-red-200">{result.error}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : result.data && result.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                            <tr>
                                                {result.columns?.map((column) => (
                                                    <th
                                                        key={column}
                                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                    >
                                                        {column}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {result.data.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    {result.columns?.map((column) => (
                                                        <td
                                                            key={column}
                                                            className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap"
                                                        >
                                                            {row[column] !== null && row[column] !== undefined
                                                                ? String(row[column])
                                                                : <span className="text-gray-400 italic">NULL</span>
                                                            }
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                    <CheckCircleIcon className="w-12 h-12 mb-3 text-green-500" />
                                    <p>Query executed successfully</p>
                                    <p className="text-sm">No rows returned</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeResultTab === 'history' && (
                        <div className="space-y-2">
                            {history.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                    <ClockIcon className="w-12 h-12 mb-3 opacity-50" />
                                    <p>No query history yet</p>
                                </div>
                            ) : (
                                history.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
                                        onClick={() => setQuery(item.query)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                {item.success ? (
                                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                                                {item.rowCount !== undefined && (
                                                    <span>{item.rowCount} rows</span>
                                                )}
                                                <span>{item.executionTime}ms</span>
                                            </div>
                                        </div>
                                        <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono overflow-x-auto">
                                            {item.query}
                                        </pre>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Keyboard Shortcuts Modal */}
            <AnimatePresence>
                {showShortcuts && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowShortcuts(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Keyboard Shortcuts
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Execute Query</span>
                                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                        Ctrl + Enter
                                    </kbd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Format Query</span>
                                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                        Ctrl + Shift + F
                                    </kbd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Show Shortcuts</span>
                                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                        Ctrl + /
                                    </kbd>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowShortcuts(false)}
                                className="mt-6 w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfessionalSQLEditor;