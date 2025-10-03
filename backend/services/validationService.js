const { getLessonDB, getTempLessonDB, cleanupTempDB } = require('../utils/db');
const { sanitizeQuery } = require('../utils/security');
const lessonService = require('./lessonService');

// A more robust function to compare two arrays of query results.
// It is immune to row order and column order.
function areResultsEqual(res1, res2) {
  if (!Array.isArray(res1) || !Array.isArray(res2)) return false;
  if (res1.length !== res2.length) return false;
  if (res1.length === 0) return true; // Both are empty, so they are equal.

  // Create a canonical string representation of each row object
  // by sorting its keys and joining key-value pairs.
  const toCanonicalString = (row) => {
    return Object.keys(row).sort().map(key => `${key}:${row[key]}`).join('|');
  };

  const set1 = new Set(res1.map(toCanonicalString));
  const set2 = new Set(res2.map(toCanonicalString));

  if (set1.size !== set2.size) return false;

  for (const item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }

  return true;
}


async function validateSolution(userQuery, lessonId, exerciseId) {
  let userDb, correctDb;
  try {
    if (!userQuery) throw new Error('Empty query');
    const lesson = lessonService.getLesson(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    let exercise = lesson.practice?.find(p => p.id === exerciseId);
    if (!exercise && lesson.challenges) {
      for (const challenge of lesson.challenges) {
        exercise = challenge.steps.find(s => s.stepId === exerciseId);
        if (exercise) break;
      }
    }

    if (!exercise) throw new Error('Exercise not found');

    // Check if this lesson teaches DDL operations
    const isDDLLesson = ['alter-table', 'create-table', 'drop-table', 'data-definition'].includes(lessonId);

    // For DDL operations, create separate temporary databases for user and correct queries
    if (isDDLLesson) {
      userDb = getTempLessonDB(lessonId);
      correctDb = getTempLessonDB(lessonId);
    } else {
      userDb = getLessonDB(lessonId);
      correctDb = userDb; // Use same db for read-only operations
    }

    // Run both queries
    const userRes = await runQuery(userDb, userQuery, isDDLLesson).catch(err => {
      return { error: err.message };
    });

    // If the user's query resulted in an error, return that immediately
    if (userRes.error) {
      return { 
        valid: false, 
        message: `Query Error: ${userRes.error}`, 
        userResult: [], 
        correctResult: [] 
      };
    }

    const correctRes = await runQuery(correctDb, exercise.solution, isDDLLesson);

    // For DDL operations, check if the operation succeeded (no error means success)
    if (isDDLLesson) {
      const isEqual = !userRes.error && !correctRes.error;
      return {
        valid: isEqual,
        message: isEqual ? 'Correct! Well done.' : 'Incorrect. Check your syntax.',
        userResult: userRes,
        correctResult: correctRes
      };
    }

    // Use the robust comparison function for SELECT queries
    const isEqual = areResultsEqual(userRes, correctRes);

    return {
      valid: isEqual,
      message: isEqual ? 'Correct! Well done.' : 'Incorrect. Compare your results with the expected output.',
      userResult: userRes,
      correctResult: correctRes
    };
  } catch (e) {
    return { valid: false, message: e.message, userResult: [], correctResult: [] };
  } finally {
    // Clean up databases
    if (userDb) {
      if (userDb.tempPath) {
        cleanupTempDB(userDb);
      } else {
        userDb.close();
      }
    }
    if (correctDb && correctDb !== userDb && correctDb.tempPath) {
      cleanupTempDB(correctDb);
    }
  }
}


function runQuery(db, query, allowDDL = false) {
  return new Promise((resolve, reject) => {
    try {
      const safe = sanitizeQuery(query, allowDDL);
      
      // For DDL operations (ALTER, CREATE, DROP), use db.run instead of db.all
      if (allowDDL) {
        db.run(safe, function(err) {
          if (err) reject(err);
          else resolve({ success: true, changes: this.changes });
        });
      } else {
        db.all(safe, (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = { validateSolution };
