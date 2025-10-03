import React, { useState } from 'react';
import {
  TableCellsIcon,
  KeyIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface Column {
  name: string;
  type: string;
  constraints?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isNullable?: boolean;
  defaultValue?: string;
}

interface Table {
  name: string;
  columns: Column[];
  sampleData?: Record<string, any>[];
}

interface DatabaseSchema {
  tables: Table[];
}

interface SchemaVisualizerProps {
  schema: DatabaseSchema;
  onTableSelect?: (tableName: string) => void;
  selectedTable?: string;
}

const SchemaVisualizer: React.FC<SchemaVisualizerProps> = ({
  schema,
  onTableSelect,
  selectedTable
}) => {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showSampleData, setShowSampleData] = useState<Record<string, boolean>>({});

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const toggleSampleData = (tableName: string) => {
    setShowSampleData(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const copyTableName = (tableName: string) => {
    navigator.clipboard.writeText(tableName);
  };

  const copyColumnName = (tableName: string, columnName: string) => {
    navigator.clipboard.writeText(`${tableName}.${columnName}`);
  };

  const generateSelectQuery = (tableName: string) => {
    const table = schema.tables.find(t => t.name === tableName);
    if (!table) return '';
    
    const columns = table.columns.map(col => col.name).join(', ');
    return `SELECT ${columns}\nFROM ${tableName}\nLIMIT 10;`;
  };

  const filteredTables = schema.tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.columns.some(col => 
      col.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getColumnIcon = (column: Column) => {
    if (column.isPrimaryKey) {
      return <KeyIcon className="w-4 h-4 text-yellow-500" title="Primary Key" />;
    }
    if (column.isForeignKey) {
      return <LinkIcon className="w-4 h-4 text-blue-500" title="Foreign Key" />;
    }
    return null;
  };

  const getColumnTypeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('int') || lowerType.includes('number')) {
      return 'text-blue-600 dark:text-blue-400';
    }
    if (lowerType.includes('varchar') || lowerType.includes('text') || lowerType.includes('char')) {
      return 'text-green-600 dark:text-green-400';
    }
    if (lowerType.includes('date') || lowerType.includes('time')) {
      return 'text-purple-600 dark:text-purple-400';
    }
    if (lowerType.includes('bool')) {
      return 'text-orange-600 dark:text-orange-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TableCellsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Database Schema
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({schema.tables.length} tables)
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tables and columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Tables List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredTables.length === 0 ? (
          <div className="p-8 text-center">
            <TableCellsIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No tables match your search' : 'No tables found in schema'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTables.map((table) => (
              <div key={table.name} className="p-4">
                {/* Table Header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleTable(table.name)}
                    className={`flex items-center space-x-3 text-left flex-1 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedTable === table.name ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <TableCellsIcon className="w-5 h-5 text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {table.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({table.columns.length} columns)
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => copyTableName(table.name)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                      title="Copy table name"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                    
                    {table.sampleData && (
                      <button
                        onClick={() => toggleSampleData(table.name)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                        title="Toggle sample data"
                      >
                        {showSampleData[table.name] ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Columns */}
                {expandedTables.has(table.name) && (
                  <div className="mt-3 ml-7 space-y-2">
                    {table.columns.map((column) => (
                      <div
                        key={column.name}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getColumnIcon(column)}
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {column.name}
                          </span>
                          <span className={`text-sm font-medium ${getColumnTypeColor(column.type)}`}>
                            {column.type}
                          </span>
                          {column.constraints && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                              {column.constraints}
                            </span>
                          )}
                          {!column.isNullable && (
                            <span className="text-xs text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">
                              NOT NULL
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => copyColumnName(table.name, column.name)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                          title="Copy column reference"
                        >
                          <DocumentDuplicateIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Sample Query */}
                    <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Sample Query
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(generateSelectQuery(table.name))}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                        {generateSelectQuery(table.name)}
                      </pre>
                    </div>

                    {/* Sample Data */}
                    {table.sampleData && showSampleData[table.name] && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                          Sample Data (first 3 rows)
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-blue-200 dark:border-blue-800">
                                {table.columns.slice(0, 4).map((col) => (
                                  <th key={col.name} className="text-left py-1 pr-3 font-medium text-blue-700 dark:text-blue-300">
                                    {col.name}
                                  </th>
                                ))}
                                {table.columns.length > 4 && (
                                  <th className="text-left py-1 text-blue-600 dark:text-blue-400">...</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {table.sampleData.slice(0, 3).map((row, index) => (
                                <tr key={index} className="border-b border-blue-100 dark:border-blue-900">
                                  {table.columns.slice(0, 4).map((col) => (
                                    <td key={col.name} className="py-1 pr-3 text-blue-800 dark:text-blue-200">
                                      {String(row[col.name] || 'NULL')}
                                    </td>
                                  ))}
                                  {table.columns.length > 4 && (
                                    <td className="py-1 text-blue-600 dark:text-blue-400">...</td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaVisualizer;