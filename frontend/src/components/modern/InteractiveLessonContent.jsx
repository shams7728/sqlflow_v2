import { useState } from 'react';

const InteractiveLessonContent = ({ lesson }) => {
  const [activeTab, setActiveTab] = useState('theory');
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [practiceResults, setPracticeResults] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [showPracticeHints, setShowPracticeHints] = useState({});

  // Handle practice submission
  const handlePracticeSubmit = (practiceId, userAnswer) => {
    const practice = lesson.practice.find(p => p.id === practiceId);
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
  };

  // Handle quiz submission
  const handleQuizSubmit = (questionId, userAnswer) => {
    const question = lesson.quiz.find(q => q.id === questionId);
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
  };

  // Toggle hint visibility
  const toggleHint = (practiceId) => {
    setShowPracticeHints(prev => ({
      ...prev,
      [practiceId]: !prev[practiceId]
    }));
  };

  // Reset practice/quiz
  const resetPractice = (practiceId) => {
    setPracticeAnswers(prev => ({ ...prev, [practiceId]: '' }));
    setPracticeResults(prev => ({ ...prev, [practiceId]: null }));
    setShowPracticeHints(prev => ({ ...prev, [practiceId]: false }));
  };

  const resetQuiz = (questionId) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: '' }));
    setQuizResults(prev => ({ ...prev, [questionId]: null }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {lesson.title}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
            {lesson.category}
          </span>
          <span className={`px-2 py-1 rounded-full ${
            lesson.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
            lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' :
            'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
          }`}>
            {lesson.difficulty}
          </span>
          <span>⏱️ {lesson.estimatedTime}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {['theory', 'practice', 'quiz'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'practice' && lesson.practice && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {lesson.practice.length}
                </span>
              )}
              {tab === 'quiz' && lesson.quiz && (
                <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {lesson.quiz.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theory Tab */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {lesson.theory?.map((section, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              {section.type === 'paragraph' && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              )}
              {section.type === 'code' && (
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{section.text}</code>
                  </pre>
                </div>
              )}
              {section.type === 'note' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-blue-800 dark:text-blue-200 text-sm">
                      {section.text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Practice Tab */}
      {activeTab === 'practice' && (
        <div className="space-y-8">
          {lesson.practice?.map((practice, index) => {
            const result = practiceResults[practice.id];
            const userAnswer = practiceAnswers[practice.id] || '';
            const showHint = showPracticeHints[practice.id];

            return (
              <div key={practice.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Practice {index + 1}: {practice.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {practice.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleHint(practice.id)}
                      className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors"
                    >
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {result && (
                      <button
                        onClick={() => resetPractice(practice.id)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      💡 <strong>Hint:</strong> {practice.hint}
                    </p>
                  </div>
                )}

                {/* Code Editor */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your SQL Query:
                  </label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setPracticeAnswers(prev => ({ ...prev, [practice.id]: e.target.value }))}
                    placeholder={practice.starterCode || "-- Write your SQL query here"}
                    className="w-full h-32 p-3 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    disabled={result?.submitted}
                  />
                </div>

                {/* Submit Button */}
                {!result?.submitted && (
                  <button
                    onClick={() => handlePracticeSubmit(practice.id, userAnswer)}
                    disabled={!userAnswer.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answer
                  </button>
                )}

                {/* Results */}
                {result?.submitted && (
                  <div className={`mt-4 p-4 rounded-lg border-2 ${
                    result.isCorrect 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center mb-2">
                      {result.isCorrect ? (
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`font-semibold ${
                        result.isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        {result.isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    
                    {!result.isCorrect && (
                      <div className="mt-3">
                        <p className="text-red-800 dark:text-red-200 text-sm font-medium mb-2">
                          Correct Answer:
                        </p>
                        <div className="bg-gray-900 rounded-lg p-3">
                          <pre className="text-green-400 text-sm">
                            <code>{result.correctAnswer}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {lesson.quiz?.map((question, index) => {
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
                {question.type === 'mcq' && (
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
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
                          <svg className="w-5 h-5 text-green-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
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
                          value={option}
                          checked={userAnswer === option}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, [question.id]: e.target.value === 'true' }))}
                          disabled={result?.submitted}
                          className="mr-3"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{option ? 'True' : 'False'}</span>
                        {result?.submitted && option === question.answer && (
                          <svg className="w-5 h-5 text-green-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
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
          })}
        </div>
      )}
    </div>
  );
};

export default InteractiveLessonContent;