import React, { useRef, useEffect, useState, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { 
  PlayIcon, 
  DocumentDuplicateIcon, 
  ArrowPathIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../../stores/themeStore';

interface EnhancedSQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  isExecuting?: boolean;
  error?: string | null;
  executionTime?: number;
  lessonId?: string;
  height?: string;
  readOnly?: boolean;
}

interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  executionTime?: number;
  success: boolean;
}

const EnhancedSQLEditor: React.FC<EnhancedSQLEditorProps> = ({
  value,
  onChange,
  onExecute,
  isExecuting = false,
  error = null,
  executionTime,
  lessonId,
  height = '400px',
  readOnly = false
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const { theme } = useThemeStore();
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // SQL Keywords for autocomplete
  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE',
    'ALTER', 'DROP', 'INDEX', 'TABLE', 'DATABASE', 'DISTINCT', 'COUNT', 'SUM',
    'AVG', 'MIN', 'MAX', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
    'IS NULL', 'IS NOT NULL', 'LIMIT', 'OFFSET', 'UNION', 'CASE', 'WHEN', 'THEN',
    'ELSE', 'END', 'EXISTS', 'SUBQUERY'
  ];

  const handleEditorDidMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure SQL language features
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model, position) => {
        const suggestions = sqlKeywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column,
          },
        }));

        return { suggestions };
      },
    });

    // Add custom SQL snippets
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const snippets = [
          {
            label: 'select-template',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'SELECT ${1:columns}\nFROM ${2:table}\nWHERE ${3:condition};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Basic SELECT template',
            range: range,
          },
          {
            label: 'join-template',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'SELECT ${1:columns}\nFROM ${2:table1} t1\nJOIN ${3:table2} t2 ON t1.${4:column} = t2.${5:column};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'JOIN template',
            range: range,
          },
        ];
        return { suggestions: snippets };
      },
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (!isExecuting) {
        onExecute();
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      // Format SQL query
      editor.getAction('editor.action.formatDocument')?.run();
    });
  }, [isExecuting, onExecute]);

  const handleExecute = useCallback(() => {
    if (value.trim() && !isExecuting) {
      // Add to history
      const historyItem: QueryHistory = {
        id: Date.now().toString(),
        query: value,
        timestamp: new Date(),
        success: !error
      };
      
      setQueryHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
      onExecute();
    }
  }, [value, isExecuting, error, onExecute]);

  const copyToClipboard = useCallback(() => {
    if (value) {
      navigator.clipboard.writeText(value);
    }
  }, [value]);

  const formatQuery = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  }, []);

  const clearEditor = useCallback(() => {
    onChange('');
  }, [onChange]);

  const loadFromHistory = useCallback((query: string) => {
    onChange(query);
    setShowHistory(false);
  }, [onChange]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
            SQL Editor
          </span>
          {lessonId && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Lesson: {lessonId}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Execution Status */}
          {executionTime && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="w-3 h-3" />
              <span>{executionTime}ms</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center space-x-1 text-xs text-red-500">
              <ExclamationTriangleIcon className="w-3 h-3" />
              <span>Error</span>
            </div>
          )}

          {!error && !isExecuting && executionTime && (
            <div className="flex items-center space-x-1 text-xs text-green-500">
              <CheckCircleIcon className="w-3 h-3" />
              <span>Success</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Query History"
            >
              <ClockIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={copyToClipboard}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copy Query (Ctrl+C)"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={formatQuery}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Format Query (Ctrl+K)"
            >
              <SparklesIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={clearEditor}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Clear Editor"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Query History Dropdown */}
      {showHistory && queryHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Queries</h4>
            {queryHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => loadFromHistory(item.query)}
                className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {item.query.substring(0, 50)}...
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Monaco Editor */}
      <div style={{ height }}>
        <Editor
          height="100%"
          language="sql"
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 20,
            fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly,
            cursorStyle: 'line',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            contextmenu: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'matchingDocuments',
            parameterHints: {
              enabled: true,
            },
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <span>SQL</span>
          <span>•</span>
          <span>Ctrl+Enter to execute</span>
          <span>•</span>
          <span>Ctrl+K to format</span>
        </div>

        <button
          onClick={handleExecute}
          disabled={isExecuting || !value.trim()}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
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
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">SQL Error</p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1 font-mono">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSQLEditor;