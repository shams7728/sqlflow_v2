const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

function getLessonDB(lessonId, readOnly = true) {
  const dbPath = path.resolve(__dirname, '../lesson-data', `lesson_${lessonId}.db`);

  if (!fs.existsSync(dbPath)) {
    throw new Error(`❌ Database not found: lesson_${lessonId}.db`);
  }

  const mode = readOnly
    ? sqlite3.OPEN_READONLY
    : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;

  return new sqlite3.Database(dbPath, mode);
}

// Create a temporary writable copy of the database for DDL operations
function getTempLessonDB(lessonId) {
  const originalPath = path.resolve(__dirname, '../lesson-data', `lesson_${lessonId}.db`);
  const tempPath = path.resolve(__dirname, '../lesson-data', `temp_${lessonId}_${Date.now()}.db`);

  if (!fs.existsSync(originalPath)) {
    throw new Error(`❌ Database not found: lesson_${lessonId}.db`);
  }

  // Copy the original database to a temporary file
  fs.copyFileSync(originalPath, tempPath);

  // Open the temporary database in read-write mode
  const db = new sqlite3.Database(tempPath, sqlite3.OPEN_READWRITE);
  
  // Store the temp path so we can delete it later
  db.tempPath = tempPath;
  
  return db;
}

// Clean up temporary database
function cleanupTempDB(db) {
  if (db && db.tempPath) {
    const tempPath = db.tempPath;
    db.close(() => {
      try {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      } catch (err) {
        console.error('Failed to cleanup temp database:', err);
      }
    });
  } else if (db) {
    db.close();
  }
}

module.exports = { getLessonDB, getTempLessonDB, cleanupTempDB };
