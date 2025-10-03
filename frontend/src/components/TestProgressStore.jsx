import React from 'react';
import { useProgressStoreWrapper } from '../hooks/useProgressStoreWrapper';

const TestProgressStore = () => {
  const {
    getLessonProgress,
    updateLessonProgress,
    toggleBookmark,
    saveNotes,
    trackEvent
  } = useProgressStoreWrapper();

  const testProgress = getLessonProgress('test-lesson');

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Progress Store Test</h2>
      <div className="space-y-2">
        <p>Progress Store Functions Available:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>getLessonProgress: {typeof getLessonProgress}</li>
          <li>updateLessonProgress: {typeof updateLessonProgress}</li>
          <li>toggleBookmark: {typeof toggleBookmark}</li>
          <li>saveNotes: {typeof saveNotes}</li>
          <li>trackEvent: {typeof trackEvent}</li>
        </ul>
        <p className="mt-4">Test lesson progress: {JSON.stringify(testProgress)}</p>
      </div>
    </div>
  );
};

export default TestProgressStore;