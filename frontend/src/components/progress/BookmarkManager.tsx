import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookmarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  StarIcon,
  TagIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useProgressStore } from '../../stores/progressStore';

interface BookmarkedLesson {
  lessonId: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  notes: string;
  isBookmarked: boolean;
  lastAccessedAt: string;
  progress?: {
    status: string;
    score: number;
    timeSpent: number;
  };
}

const BookmarkManager: React.FC = () => {
  const { progress, toggleBookmark, saveNotes } = useProgressStore();
  const [bookmarks, setBookmarks] = useState<BookmarkedLesson[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkedLesson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'category' | 'difficulty'>('recent');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from API
        // For now, we'll generate mock data based on progress
        const mockBookmarks = generateMockBookmarks();
        setBookmarks(mockBookmarks);
        setFilteredBookmarks(mockBookmarks);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, [progress]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = bookmarks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(bookmark => bookmark.category === categoryFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(bookmark => bookmark.difficulty === difficultyFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'difficulty':
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'recent':
        default:
          return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime();
      }
    });

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchTerm, categoryFilter, difficultyFilter, sortBy]);

  const generateMockBookmarks = (): BookmarkedLesson[] => {
    return [
      {
        lessonId: 'select-basics',
        title: 'SELECT Statement Basics',
        category: 'Fundamentals',
        difficulty: 'Beginner',
        notes: 'Remember to use DISTINCT for unique values',
        isBookmarked: true,
        lastAccessedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        progress: { status: 'completed', score: 95, timeSpent: 1200 }
      },
      {
        lessonId: 'joins-advanced',
        title: 'Advanced JOIN Operations',
        category: 'Joins',
        difficulty: 'Advanced',
        notes: 'LEFT JOIN vs RIGHT JOIN - practice more examples',
        isBookmarked: true,
        lastAccessedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        progress: { status: 'in_progress', score: 78, timeSpent: 2400 }
      },
      {
        lessonId: 'subqueries',
        title: 'Subqueries and CTEs',
        category: 'Advanced Queries',
        difficulty: 'Expert',
        notes: 'Complex nested queries - review performance implications',
        isBookmarked: true,
        lastAccessedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        progress: { status: 'completed', score: 88, timeSpent: 3600 }
      },
      {
        lessonId: 'window-functions',
        title: 'Window Functions',
        category: 'Advanced Queries',
        difficulty: 'Expert',
        notes: 'ROW_NUMBER(), RANK(), DENSE_RANK() differences',
        isBookmarked: true,
        lastAccessedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        progress: { status: 'in_progress', score: 65, timeSpent: 1800 }
      }
    ];
  };

  const handleRemoveBookmark = async (lessonId: string) => {
    try {
      await toggleBookmark(lessonId);
      setBookmarks(prev => prev.filter(b => b.lessonId !== lessonId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const handleSaveNotes = async (lessonId: string) => {
    try {
      await saveNotes(lessonId, noteText);
      setBookmarks(prev => prev.map(b => 
        b.lessonId === lessonId ? { ...b, notes: noteText } : b
      ));
      setEditingNotes(null);
      setNoteText('');
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const startEditingNotes = (lessonId: string, currentNotes: string) => {
    setEditingNotes(lessonId);
    setNoteText(currentNotes);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'in_progress':
        return 'text-blue-600 dark:text-blue-400';
      case 'not_started':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const categories = Array.from(new Set(bookmarks.map(b => b.category)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bookmarked Lessons</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {bookmarks.length} saved lessons for quick access
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <BookmarkSolidIcon className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {bookmarks.length}
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="recent">Recently Accessed</option>
              <option value="title">Title A-Z</option>
              <option value="category">Category</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || categoryFilter !== 'all' || difficultyFilter !== 'all' 
              ? 'No bookmarks match your filters'
              : 'No bookmarks yet'
            }
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || categoryFilter !== 'all' || difficultyFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Bookmark lessons to save them for quick access later.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredBookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.lessonId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <BookmarkSolidIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <Link
                            to={`/lesson/${bookmark.lessonId}`}
                            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {bookmark.title}
                          </Link>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <FolderIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">{bookmark.category}</span>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(bookmark.difficulty)}`}>
                            {bookmark.difficulty}
                          </span>
                          
                          {bookmark.progress && (
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-medium ${getStatusColor(bookmark.progress.status)}`}>
                                {bookmark.progress.status.replace('_', ' ')}
                              </span>
                              <span className="text-gray-400">•</span>
                              <div className="flex items-center space-x-1">
                                <StarIcon className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {bookmark.progress.score}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/lesson/${bookmark.lessonId}`}
                          className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="View lesson"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        
                        <button
                          onClick={() => startEditingNotes(bookmark.lessonId, bookmark.notes)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Edit notes"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleRemoveBookmark(bookmark.lessonId)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Remove bookmark"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notes */}
                    {editingNotes === bookmark.lessonId ? (
                      <div className="mt-4">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add your notes..."
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                          rows={3}
                        />
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => handleSaveNotes(bookmark.lessonId)}
                            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotes(null)}
                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : bookmark.notes ? (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <TagIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">{bookmark.notes}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No notes yet. Click the edit icon to add notes.
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>Last accessed {new Date(bookmark.lastAccessedAt).toLocaleDateString()}</span>
                        </div>
                        {bookmark.progress && (
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-3 h-3" />
                            <span>{Math.round(bookmark.progress.timeSpent / 60)} min spent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BookmarkManager;