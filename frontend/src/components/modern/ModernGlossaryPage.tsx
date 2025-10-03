import React, { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  TagIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  FunnelIcon,
  XMarkIcon,
  SparklesIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { glossaryTerms } from '../../data/glossary/terms';

interface GlossaryTerm {
  term: string;
  definition: string;
  syntax?: string;
  example?: string;
  category: string;
}

const ModernGlossaryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(glossaryTerms.map(term => term.category))];
    return cats;
  }, []);

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const openTermModal = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTerm(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'DML (Data Manipulation Language)': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'DDL (Data Definition Language)': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Clauses': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Joins': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'Aggregate Functions': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'Constraints': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'Set Operations': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      'Performance & Advanced': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'Functions & Expressions': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
      'DCL (Data Control Language)': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      'TCL (Transaction Control Language)': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpenIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                SQL Glossary
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Comprehensive reference for SQL terms and concepts
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {glossaryTerms.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Terms</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <TagIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {categories.length - 1}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredTerms.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search terms, definitions, or examples..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[200px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term, index) => (
            <div
              key={index}
              onClick={() => openTermModal(term)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {term.term}
                </h3>
                <CodeBracketIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {term.definition}
              </p>

              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(term.category)}`}>
                  {term.category.split(' ')[0]}
                </span>
                
                {term.syntax && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <CodeBracketIcon className="w-3 h-3" />
                    <span>Syntax</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No terms found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Term Detail Modal */}
      {isModalOpen && selectedTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(selectedTerm.category)}`}>
                  <CodeBracketIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedTerm.term}
                  </h2>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedTerm.category)}`}>
                    {selectedTerm.category}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Definition */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Definition
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedTerm.definition}
                </p>
              </div>

              {/* Syntax */}
              {selectedTerm.syntax && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Syntax
                    </h3>
                    <button
                      onClick={() => copyToClipboard(selectedTerm.syntax!)}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
                    {selectedTerm.syntax}
                  </pre>
                </div>
              )}

              {/* Example */}
              {selectedTerm.example && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Example
                    </h3>
                    <button
                      onClick={() => copyToClipboard(selectedTerm.example!)}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>
                  <pre className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg overflow-x-auto text-sm font-mono text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                    {selectedTerm.example}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernGlossaryPage;