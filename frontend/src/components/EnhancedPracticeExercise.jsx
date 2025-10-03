import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LightBulbIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const EnhancedPracticeExercise = ({ exercise, lessonId, onCompleted, completed, exerciseNumber, totalExercises }) => {
  const [userQuery, setUserQuery] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleValidate = async () => {
    if (!userQuery.trim()) return;

    setIsValidating(true);
    setAttempts(prev => prev + 1);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          exerciseId: exercise.id,
          query: userQuery.trim()
        })
      });

      const data = await response.json();
      setValidationResult(data);

      if (data.valid) {
        setTimeout(() => {
          onCompleted(exercise.id);
        }, 1500);
      } else {
        if (attempts >= 1) {
          setShowCorrectAnswer(true);
        }
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        message: 'Failed to validate. Please check your connection and try again.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleReset = () => {
    setUserQuery('');
    setValidationResult(null);
    setShowHint(false);
    setShowCorrectAnswer(false);
    setAttempts(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-medium rounded">
              Question {exerciseNumber} of {totalExercises}
            </span>
            {completed && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded flex items-center space-x-1">
                <CheckCircleIcon className="w-3 h-3" />
                <span>Completed</span>
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {exercise.title || `Practice ${exerciseNumber}`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {exercise.description || exercise.challenge}
          </p>
        </div>

        {exercise.hint && !completed && (
          <button
            onClick={() => setShowHint(!showHint)}
            className={`ml-4 p-2 rounded-lg transition-colors ${showHint
              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            title="Show Hint"
          >
            <LightBulbIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Hint Display */}
      <AnimatePresence>
        {showHint && exercise.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <LightBulbIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">Hint:</p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">{exercise.hint}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SQL Editor */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your SQL Query:
        </label>
        <textarea
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Write your SQL query here..."
          disabled={completed}
          className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
        />
      </div>

      {/* Action Buttons */}
      {!completed && (
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={handleValidate}
            disabled={!userQuery.trim() || isValidating}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Checking...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                <span>Check Answer</span>
              </>
            )}
          </button>

          {validationResult && !validationResult.valid && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Validation Result */}
      <AnimatePresence>
        {validationResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border ${validationResult.valid
              ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
              }`}
          >
            <div className="flex items-start space-x-3">
              {validationResult.valid ? (
                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${validationResult.valid
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-red-900 dark:text-red-100'
                  }`}>
                  {validationResult.message}
                </p>

                {!validationResult.valid && attempts > 0 && (
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Attempts: {attempts}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Correct Answer after 2 attempts */}
      <AnimatePresence>
        {showCorrectAnswer && !completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <ArrowRightIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Correct Answer:
                </p>
                <pre className="text-sm text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/20 p-3 rounded overflow-x-auto font-mono">
                  {exercise.solution}
                </pre>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                  Study this solution and try to understand the syntax. You can try again or move to the next question.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed State */}
      {completed && (
        <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                Excellent work! You've completed this exercise.
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your solution was correct. Keep up the great work!
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedPracticeExercise;
