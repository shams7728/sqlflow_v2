import React, { useState, useMemo } from 'react';
import {
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  LightBulbIcon,
  CodeBracketIcon,
  PlayIcon,
  BookmarkIcon,
  FireIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { comprehensiveInterviewQuestions as interviewQuestions } from '../../data/interviewQuestions';



const ModernInterviewPrepPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set());

  // Get unique categories and difficulties
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(interviewQuestions.map(q => q.category)))];
  }, []);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Filter questions based on search, difficulty, and category
  const filteredQuestions = useMemo(() => {
    return interviewQuestions.filter(question => {
      const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = selectedDifficulty === 'All' || question.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'All' || question.category === selectedCategory;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [searchTerm, selectedDifficulty, selectedCategory]);

  const toggleExpanded = (questionId: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const toggleCompleted = (questionId: number) => {
    setCompletedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (questionId: number) => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Fundamentals': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'Joins': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Clauses': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Functions': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'Performance': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'Advanced': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      'Constraints': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'Transactions': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  const completionPercentage = Math.round((completedQuestions.size / interviewQuestions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4 md:py-6 responsive-container">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <AcademicCapIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                SQL Interview Preparation
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Master SQL interviews with comprehensive questions and detailed explanations
              </p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <BookmarkIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {interviewQuestions.length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Total Questions
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {completedQuestions.size}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Completed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <TrophyIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {completionPercentage}%
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Progress
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <FireIcon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {bookmarkedQuestions.size}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Bookmarked
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Interview Preparation Progress
              </span>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {completedQuestions.size}/{interviewQuestions.length} questions
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row lg:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions, answers, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="sm:w-40 lg:w-48">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'All' ? 'All Difficulties' : difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="sm:w-40 lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedDifficulty !== 'All' || selectedCategory !== 'All') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedDifficulty !== 'All' && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedDifficulty)}`}>
                  {selectedDifficulty}
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedCategory)}`}>
                  {selectedCategory}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredQuestions.map((question, index) => {
            const isExpanded = expandedQuestions.has(question.id);
            const isCompleted = completedQuestions.has(question.id);
            const isBookmarked = bookmarkedQuestions.has(question.id);

            return (
              <div
                key={question.id}
                className={`bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 hover:shadow-lg ${isCompleted
                  ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-700'
                  }`}
              >
                {/* Question Header */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold ${isCompleted
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
                          {question.question}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                            {question.category}
                          </span>
                          {question.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              #{tag}
                            </span>
                          ))}
                          {question.tags.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{question.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 flex-shrink-0">
                      <button
                        onClick={() => toggleBookmark(question.id)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isBookmarked
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                          }`}
                      >
                        <BookmarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => toggleCompleted(question.id)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isCompleted
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                          }`}
                      >
                        <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => toggleExpanded(question.id)}
                        className="p-1.5 sm:p-2 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 transition-all duration-200"
                      >
                        {isExpanded ? (
                          <ChevronUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Answer */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 animate-slide-down">
                    <div className="space-y-4 sm:space-y-6">
                      {/* Answer */}
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <LightBulbIcon className="w-5 h-5 text-yellow-500" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">Answer</h4>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {question.answer}
                        </p>
                      </div>

                      {/* SQL Example */}
                      {question.sqlExample && (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <CodeBracketIcon className="w-5 h-5 text-blue-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-white">SQL Example</h4>
                          </div>
                          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                              {question.sqlExample}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      {question.explanation && (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <SparklesIcon className="w-5 h-5 text-purple-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-white">Explanation</h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {question.explanation}
                          </p>
                        </div>
                      )}

                      {/* Follow-up Questions */}
                      {question.followUpQuestions && question.followUpQuestions.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <PlayIcon className="w-5 h-5 text-green-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-white">Follow-up Questions</h4>
                          </div>
                          <ul className="space-y-2">
                            {question.followUpQuestions.map((followUp, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="text-primary-500 mt-1">•</span>
                                <span className="text-gray-700 dark:text-gray-300">{followUp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* All Tags */}
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <FunnelIcon className="w-5 h-5 text-gray-500" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">Tags</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {question.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No questions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms or filters to find more questions.
            </p>
          </div>
        )}

        {/* Results Summary */}
        {filteredQuestions.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredQuestions.length} of {interviewQuestions.length} questions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernInterviewPrepPage;