import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CommandLineIcon,
  TableCellsIcon,
  ClockIcon,
  BookmarkIcon,
  PencilIcon,
  TrophyIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

import EnhancedSQLEditor from './EnhancedSQLEditor';
import QueryResultsDisplay from './QueryResultsDisplay';
import SchemaVisualizer from './SchemaVisualizer';
import EnhancedPracticeExercise from '../EnhancedPracticeExercise';
import JoinVisualizer from '../JoinVisualizer';
import AchievementToast from '../AchievementToast';
import ProgressNotification from '../ProgressNotification';
import { Lesson } from '../../types';
import { useProgressStoreWrapper } from '../../hooks/useProgressStoreWrapper';
import { Achievement } from '../../stores/progressStore';

interface AdvancedSQLWorkspaceProps {
  lesson: Lesson;
}

interface QueryResult {
  success: boolean;
  data?: any[];
  columns?: string[];
  error?: string;
  executionTime?: number;
}

const AdvancedSQLWorkspace: React.FC<AdvancedSQLWorkspaceProps> = ({ lesson }) => {
  // Default progress object to ensure type consistency - memoized to prevent re-renders
  const defaultProgress = useMemo(() => ({
    status: 'not_started' as const,
    score: 0,
    attempts: 0,
    timeSpent: 0,
    notes: '',
    isBookmarked: false
  }), []);

  // All hooks must be called before any conditional returns
  const [query, setQuery] = useState(lesson?.starterQuery || '');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'practice' | 'quiz' | 'schema' | 'notes'>('editor');
  const [executionHistory, setExecutionHistory] = useState<Array<{
    query: string;
    result: QueryResult;
    timestamp: Date;
  }>>([]);

  // Progress tracking integration - always call the hook
  const {
    getLessonProgress,
    updateLessonProgress,
    toggleBookmark,
    saveNotes,
    trackEvent
  } = useProgressStoreWrapper();

  const [lessonProgress, setLessonProgress] = useState(
    lesson?.id ? (getLessonProgress(lesson.id) || defaultProgress) : defaultProgress
  );
  const [notes, setNotes] = useState(lessonProgress?.notes || '');
  const [isBookmarked, setIsBookmarked] = useState(lessonProgress?.isBookmarked || false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [progressMessage, setProgressMessage] = useState<{message: string; type: 'success' | 'info' | 'warning'} | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  
  // Practice and Quiz state
  const [practiceAnswers, setPracticeAnswers] = useState<{[key: string]: string}>({});
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: any}>({});
  const [practiceResults, setPracticeResults] = useState<{[key: string]: any}>({});
  const [quizResults, setQuizResults] = useState<{[key: string]: any}>({});
  const [showPracticeHints, setShowPracticeHints] = useState<{[key: string]: boolean}>({});

  // Update query when lesson changes
  useEffect(() => {
    if (!lesson?.id) return; // Early return if no lesson
    
    if (lesson?.starterQuery) {
      setQuery(lesson.starterQuery);
    }
    
    // Load lesson progress
    const progress = getLessonProgress(lesson.id) || defaultProgress;
    setLessonProgress(progress);
    setNotes(progress?.notes || '');
    setIsBookmarked(progress?.isBookmarked || false);
    setSessionStartTime(Date.now());
    
    // Track lesson start event
    trackEvent('lesson_start', { lessonId: lesson.id });
  }, [lesson?.id, lesson?.starterQuery, getLessonProgress, trackEvent, defaultProgress]);

  // Update progress when lesson is completed
  const updateProgress = useCallback(async (updates: any) => {
    if (!lesson?.id) return;
    
    try {
      const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
      const achievements = await updateLessonProgress(lesson.id, {
        ...updates,
        timeSpent
      });
      
      // Show achievement notifications
      if (achievements && achievements.length > 0) {
        achievements.forEach((achievement: Achievement, index: number) => {
          setTimeout(() => {
            setNewAchievement(achievement);
          }, index * 6000); // Stagger multiple achievements
        });
      }
      
      // Show progress notification based on status
      if (updates.status === 'completed') {
        setProgressMessage({
          message: `🎉 Lesson completed! You earned ${updates.score || 0} points!`,
          type: 'success'
        });
      } else if (updates.status === 'in_progress') {
        setProgressMessage({
          message: '📝 Progress saved!',
          type: 'info'
        });
      }
      
      // Refresh lesson progress
      const updatedProgress = getLessonProgress(lesson.id) || defaultProgress;
      setLessonProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
      setProgressMessage({
        message: '⚠️ Failed to save progress. Please try again.',
        type: 'warning'
      });
    }
  }, [lesson?.id, sessionStartTime, updateLessonProgress, getLessonProgress, defaultProgress]);

  const executeQuery = useCallback(async () => {
    if (!query.trim() || isExecuting || !lesson?.id) return;

    setIsExecuting(true);
    setResult(null);

    const startTime = Date.now();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lessonId: lesson.id, 
          query: query.trim() 
        })
      });

      const data = await response.json();
      const executionTime = Date.now() - startTime;

      const queryResult: QueryResult = {
        success: data.success,
        data: data.data,
        columns: data.columns,
        error: data.error,
        executionTime
      };

      setResult(queryResult);

      // Add to execution history
      setExecutionHistory(prev => [
        {
          query: query.trim(),
          result: queryResult,
          timestamp: new Date()
        },
        ...prev.slice(0, 9) // Keep last 10 executions
      ]);

      // Track query execution and update progress
      await trackEvent('query_execution', {
        lessonId: lesson.id,
        success: queryResult.success,
        executionTime,
        queryLength: query.trim().length
      });

      // Update progress based on execution success
      if (queryResult.success) {
        const currentProgress = getLessonProgress(lesson.id);
        const newAttempts = (currentProgress?.attempts || 0) + 1;
        
        // Calculate score based on success rate and execution time
        let score = 70; // Base score for successful execution
        if (executionTime < 5000) score += 10; // Bonus for fast execution
        if (!queryResult.error) score += 20; // Bonus for no errors
        
        await updateProgress({
          status: 'in_progress',
          score: Math.max(currentProgress?.score || 0, score),
          attempts: newAttempts
        });
      }

    } catch (err) {
      const queryResult: QueryResult = {
        success: false,
        error: 'Failed to connect to backend',
        executionTime: Date.now() - startTime
      };
      setResult(queryResult);
      
      // Track failed execution
      await trackEvent('query_execution', {
        lessonId: lesson.id,
        success: false,
        executionTime: queryResult.executionTime,
        error: queryResult.error
      });
    } finally {
      setIsExecuting(false);
    }
  }, [query, lesson?.id, isExecuting, trackEvent, getLessonProgress, updateProgress]);

  // AI functions removed

  // Handle bookmark toggle
  const handleBookmarkToggle = useCallback(async () => {
    if (!lesson?.id) return;
    
    try {
      await toggleBookmark(lesson.id);
      setIsBookmarked(!isBookmarked);
      
      await trackEvent('bookmark_toggle', {
        lessonId: lesson.id,
        bookmarked: !isBookmarked
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }, [lesson?.id, isBookmarked, toggleBookmark, trackEvent]);

  // Handle notes save
  const handleSaveNotes = useCallback(async () => {
    if (!lesson?.id) return;
    
    try {
      await saveNotes(lesson.id, notes);
      
      await trackEvent('notes_save', {
        lessonId: lesson.id,
        notesLength: notes.length
      });
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }, [lesson?.id, notes, saveNotes, trackEvent]);



  // Handle practice submission
  const handlePracticeSubmit = useCallback(async (practiceId: string, userAnswer: string) => {
    const practice = lesson.practice?.find(p => p.id === practiceId);
    if (!practice) return;
    
    const isCorrect = userAnswer.trim().toLowerCase() === practice.solution.trim().toLowerCase();
    
    setPracticeResults(prev => ({
      ...prev,
      [practiceId]: {
        isCorrect,
        userAnswer,
        correctAnswer: practice.solution,
        submitted: true
      }
    }));

    // Track practice attempt
    await trackEvent('practice_attempt', {
      lessonId: lesson.id,
      practiceId,
      isCorrect,
      attempts: (practiceResults[practiceId]?.attempts || 0) + 1
    });

    // Update progress if correct
    if (isCorrect) {
      const currentProgress = getLessonProgress(lesson.id);
      await updateProgress({
        status: 'in_progress',
        score: Math.max(currentProgress?.score || 0, 75)
      });
    }
  }, [lesson, practiceResults, trackEvent, getLessonProgress, updateProgress]);

  // Handle quiz submission
  const handleQuizSubmit = useCallback(async (questionId: string, userAnswer: any) => {
    const question = lesson.quiz?.find(q => q.id === questionId);
    if (!question) return;
    
    const isCorrect = userAnswer === question.answer;
    
    setQuizResults(prev => ({
      ...prev,
      [questionId]: {
        isCorrect,
        userAnswer,
        correctAnswer: question.answer,
        explanation: question.explanation,
        submitted: true
      }
    }));

    // Track quiz attempt
    await trackEvent('quiz_attempt', {
      lessonId: lesson.id,
      questionId,
      isCorrect,
      attempts: (quizResults[questionId]?.attempts || 0) + 1
    });

    // Update progress if correct
    if (isCorrect) {
      const currentProgress = getLessonProgress(lesson.id);
      await updateProgress({
        status: 'in_progress',
        score: Math.max(currentProgress?.score || 0, 80)
      });
    }
  }, [lesson, quizResults, trackEvent, getLessonProgress, updateProgress]);

  // Toggle hint visibility
  const toggleHint = useCallback((practiceId: string) => {
    setShowPracticeHints(prev => ({
      ...prev,
      [practiceId]: !prev[practiceId]
    }));
  }, []);

  // Reset practice/quiz
  const resetPractice = useCallback((practiceId: string) => {
    setPracticeAnswers(prev => ({ ...prev, [practiceId]: '' }));
    setPracticeResults(prev => ({ ...prev, [practiceId]: null }));
    setShowPracticeHints(prev => ({ ...prev, [practiceId]: false }));
  }, []);

  const resetQuiz = useCallback((questionId: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: '' }));
    setQuizResults(prev => ({ ...prev, [questionId]: null }));
  }, []);

  const tabs: Array<{
    id: 'editor' | 'practice' | 'quiz' | 'schema' | 'notes';
    name: string;
    icon: any;
    description: string;
    count?: number;
  }> = [
    {
      id: 'editor',
      name: 'SQL Editor',
      icon: CommandLineIcon,
      description: 'Write and execute SQL queries'
    },
    {
      id: 'practice',
      name: 'Practice',
      icon: CheckCircleIcon,
      description: 'Interactive practice exercises',
      count: lesson.practice?.length || 0
    },
    {
      id: 'quiz',
      name: 'Quiz',
      icon: TrophyIcon,
      description: 'Test your knowledge',
      count: lesson.quiz?.length || 0
    },
    {
      id: 'schema',
      name: 'Database Schema',
      icon: TableCellsIcon,
      description: 'Explore tables and relationships'
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: PencilIcon,
      description: 'Personal notes and bookmarks'
    }
  ];

  // Early return after all hooks are called
  if (!lesson || !lesson.id) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading lesson...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Achievement Notification */}
      <AchievementToast
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      {/* Progress Notification */}
      {progressMessage && (
        <ProgressNotification
          message={progressMessage.message}
          type={progressMessage.type}
          onClose={() => setProgressMessage(null)}
        />
      )}

      {/* Progress Status Bar (Compact) */}
      {lessonProgress && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  lessonProgress.status === 'completed' ? 'bg-green-500' :
                  lessonProgress.status === 'in_progress' ? 'bg-yellow-500' :
                  'bg-gray-300'
                }`}></div>
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {lessonProgress.status ? lessonProgress.status.replace('_', ' ') : 'Not Started'}
                </span>
              </div>
              
              {lessonProgress.score > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500 dark:text-gray-400">Score:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {lessonProgress.score}%
                  </span>
                </div>
              )}
              
              {lessonProgress.attempts > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500 dark:text-gray-400">Attempts:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {lessonProgress.attempts}
                  </span>
                </div>
              )}
              
              {lessonProgress.timeSpent > 0 && (
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">
                    {Math.round(lessonProgress.timeSpent / 60)}m
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lesson Theory */}
      {lesson.theory && lesson.theory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">📘</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 break-words">
                Lesson: {lesson.title}
              </h3>
              <div className="prose prose-blue dark:prose-invert max-w-none overflow-hidden">
                {lesson.theory.map((block, index) => (
                  <div key={index} className="mb-4 break-words">
                    {block.type === 'paragraph' && (
                      <p className="text-blue-800 dark:text-blue-200 break-words overflow-wrap-anywhere">{block.text}</p>
                    )}
                    {block.type === 'code' && (
                      <pre className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg text-blue-900 dark:text-blue-100 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-words">
                        {block.text}
                      </pre>
                    )}
                    {block.type === 'note' && (
                      <div className="bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded">
                        <p className="text-yellow-800 dark:text-yellow-200 break-words overflow-wrap-anywhere">{block.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* JOIN Visualizations - Show if lesson has visual diagrams */}
      {lesson.content?.theory?.concepts && (
        <>
          {lesson.content.theory.concepts.map((concept: any, idx: number) => (
            concept.visualDiagrams && (
              <motion.div
                key={`visual-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <JoinVisualizer visualData={concept.visualDiagrams} />
              </motion.div>
            )
          ))}
        </>
      )}

      {/* Workspace Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-full">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <nav className="flex space-x-2 sm:space-x-8 px-3 sm:px-6 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                  {tab.count && tab.count > 0 && (
                    <span className="ml-1 sm:ml-2 bg-primary-500 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-hidden">
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* SQL Editor */}
              <EnhancedSQLEditor
                value={query}
                onChange={setQuery}
                onExecute={executeQuery}
                isExecuting={isExecuting}
                error={result?.error}
                executionTime={result?.executionTime}
                lessonId={lesson.id}
                height="400px"
              />

              {/* AI buttons removed */}

              {/* Query Results */}
              <QueryResultsDisplay result={result} isLoading={isExecuting} />
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-4">
              {lesson.practice && lesson.practice.length > 0 ? (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Practice Exercises
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Complete {lesson.practice.length} practice questions to master this lesson. 
                      Each question tests your understanding of the concepts you just learned.
                    </p>
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <span className="text-blue-600 dark:text-blue-400">
                        ✓ Case-insensitive validation
                      </span>
                      <span className="text-blue-600 dark:text-blue-400">
                        ✓ Hints available
                      </span>
                      <span className="text-blue-600 dark:text-blue-400">
                        ✓ See correct answers
                      </span>
                    </div>
                  </div>

                  {lesson.practice.map((practice, index) => (
                    <EnhancedPracticeExercise
                      key={practice.id}
                      exercise={practice}
                      lessonId={lesson.id}
                      onCompleted={(exerciseId: string) => {
                        setPracticeResults(prev => ({
                          ...prev,
                          [exerciseId]: { submitted: true, isCorrect: true }
                        }));
                      }}
                      completed={practiceResults[practice.id]?.isCorrect || false}
                      exerciseNumber={index + 1}
                      totalExercises={lesson.practice.length}
                    />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No practice exercises available for this lesson.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {lesson.quiz && lesson.quiz.length > 0 ? (
                lesson.quiz.map((question, index) => {
                  const result = quizResults[question.id];
                  const userAnswer = quizAnswers[question.id];

                  return (
                    <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Question {index + 1}
                        </h3>
                        {result && (
                          <button
                            onClick={() => resetQuiz(question.id)}
                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {question.question}
                      </p>

                      {/* Multiple Choice Questions */}
                      {question.type === 'mcq' && question.options && (
                        <div className="space-y-2 mb-4">
                          {question.options.map((option: string, optionIndex: number) => (
                            <label
                              key={optionIndex}
                              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                result?.submitted
                                  ? option === question.answer
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : userAnswer === option && option !== question.answer
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                  : userAnswer === option
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={userAnswer === option}
                                onChange={(e) => setQuizAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                                disabled={result?.submitted}
                                className="mr-3"
                              />
                              <span className="text-gray-700 dark:text-gray-300">{option}</span>
                              {result?.submitted && option === question.answer && (
                                <CheckCircleIcon className="w-5 h-5 text-green-600 ml-auto" />
                              )}
                              {result?.submitted && userAnswer === option && option !== question.answer && (
                                <svg className="w-5 h-5 text-red-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                            </label>
                          ))}
                        </div>
                      )}

                      {/* True/False Questions */}
                      {question.type === 'truefalse' && (
                        <div className="space-y-2 mb-4">
                          {[true, false].map((option) => (
                            <label
                              key={option.toString()}
                              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                result?.submitted
                                  ? option === question.answer
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : userAnswer === option && option !== question.answer
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                  : userAnswer === option
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option.toString()}
                                checked={userAnswer === option}
                                onChange={(e) => setQuizAnswers(prev => ({ ...prev, [question.id]: e.target.value === 'true' }))}
                                disabled={result?.submitted}
                                className="mr-3"
                              />
                              <span className="text-gray-700 dark:text-gray-300">{option ? 'True' : 'False'}</span>
                              {result?.submitted && option === question.answer && (
                                <CheckCircleIcon className="w-5 h-5 text-green-600 ml-auto" />
                              )}
                              {result?.submitted && userAnswer === option && option !== question.answer && (
                                <svg className="w-5 h-5 text-red-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Submit Button */}
                      {!result?.submitted && userAnswer !== undefined && (
                        <button
                          onClick={() => handleQuizSubmit(question.id, userAnswer)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Submit Answer
                        </button>
                      )}

                      {/* Explanation */}
                      {result?.submitted && question.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Explanation:</h4>
                          <p className="text-blue-700 dark:text-blue-300 text-sm">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No quiz questions available for this lesson.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schema' && lesson.schema && (
            <SchemaVisualizer
              schema={lesson.schema}
              onTableSelect={(tableName) => {
                // Auto-generate a basic SELECT query
                const table = lesson.schema?.tables.find(t => t.name === tableName);
                if (table) {
                  const columns = table.columns.slice(0, 5).map(col => col.name).join(', ');
                  setQuery(`SELECT ${columns}\nFROM ${tableName}\nLIMIT 10;`);
                  setActiveTab('editor');
                }
              }}
            />
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Notes Editor */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <PencilIcon className="w-5 h-5" />
                    <span>Personal Notes</span>
                  </h4>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your personal notes about this lesson..."
                  className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
                
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {notes.length} characters • Notes are automatically saved with your progress
                </div>
              </div>

              {/* Bookmark Status */}
              <div className={`rounded-xl border p-6 ${
                isBookmarked 
                  ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                  : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isBookmarked ? (
                      <BookmarkSolidIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <BookmarkIcon className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <h4 className={`font-medium ${
                        isBookmarked 
                          ? 'text-yellow-900 dark:text-yellow-100' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {isBookmarked ? 'Lesson Bookmarked' : 'Bookmark This Lesson'}
                      </h4>
                      <p className={`text-sm ${
                        isBookmarked 
                          ? 'text-yellow-700 dark:text-yellow-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {isBookmarked 
                          ? 'This lesson is saved to your bookmarks for quick access'
                          : 'Save this lesson to your bookmarks for easy reference'
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleBookmarkToggle}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isBookmarked
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                  </button>
                </div>
              </div>

              {/* Progress Summary */}
              {lessonProgress && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                  <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center space-x-2">
                    <TrophyIcon className="w-5 h-5" />
                    <span>Your Progress</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {lessonProgress.score}%
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {lessonProgress.attempts}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Attempts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {Math.round(lessonProgress.timeSpent / 60)}m
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Time Spent</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold capitalize ${
                        lessonProgress.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                        lessonProgress.status === 'in_progress' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {lessonProgress.status ? lessonProgress.status.replace('_', ' ') : 'Not Started'}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Status</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default AdvancedSQLWorkspace;