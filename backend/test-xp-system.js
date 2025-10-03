/**
 * Test Script for XP and Achievement System
 * Run with: node test-xp-system.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Progress = require('./models/Progress');
const UserStats = require('./models/UserStats');
const Achievement = require('./models/Achievement');
const { awardXP, checkAchievements, updateStreak, XP_REWARDS } = require('./services/xpService');

const TEST_USER_ID = 'test-user-' + Date.now();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function connectDB() {
  // Try local MongoDB first, then Atlas
  const uris = [
    process.env.MONGO_URI_LOCAL,
    process.env.MONGO_URI,
    'mongodb://127.0.0.1:27017/sqlflow'
  ];
  
  for (const uri of uris) {
    if (!uri) continue;
    
    try {
      log(`Trying to connect to: ${uri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'}...`, 'yellow');
      await mongoose.connect(uri);
      log('✓ Connected to MongoDB', 'green');
      return true;
    } catch (error) {
      log(`✗ Connection failed: ${error.message}`, 'red');
    }
  }
  
  log('\n💡 Tip: Make sure MongoDB is running:', 'yellow');
  log('   - For local: Start MongoDB service', 'yellow');
  log('   - For Atlas: Check credentials in .env file', 'yellow');
  return false;
}

async function cleanup() {
  log('\n🧹 Cleaning up test data...', 'yellow');
  await Progress.deleteMany({ userId: TEST_USER_ID });
  await UserStats.deleteMany({ userId: TEST_USER_ID });
  await Achievement.deleteMany({ userId: TEST_USER_ID });
  log('✓ Cleanup complete', 'green');
}

async function testXPSystem() {
  log('\n📊 Testing XP System...', 'cyan');
  
  // Test 1: Award XP
  log('\nTest 1: Awarding XP', 'blue');
  const xpResult = await awardXP(TEST_USER_ID, 100, 'Test XP award');
  
  if (xpResult.success) {
    log(`✓ XP awarded: ${xpResult.xpAwarded}`, 'green');
    log(`  Total XP: ${xpResult.totalXP}`, 'green');
    log(`  Level: ${xpResult.newLevel}`, 'green');
  } else {
    log(`✗ Failed to award XP: ${xpResult.error}`, 'red');
    return false;
  }
  
  // Test 2: Check level calculation
  log('\nTest 2: Level Calculation', 'blue');
  const stats = await UserStats.findOne({ userId: TEST_USER_ID });
  const levelProgress = stats.getLevelProgress();
  
  log(`✓ Level: ${levelProgress.level}`, 'green');
  log(`  Current XP: ${levelProgress.currentXP}`, 'green');
  log(`  XP to next level: ${levelProgress.xpToNextLevel}`, 'green');
  log(`  Progress: ${levelProgress.progress.toFixed(2)}%`, 'green');
  
  // Test 3: Award more XP to test level up
  log('\nTest 3: Testing Level Up', 'blue');
  const levelUpResult = await awardXP(TEST_USER_ID, 500, 'Level up test');
  
  if (levelUpResult.leveledUp) {
    log(`✓ Level up! ${levelUpResult.oldLevel} → ${levelUpResult.newLevel}`, 'green');
  } else {
    log(`  No level up yet (Level ${levelUpResult.newLevel})`, 'yellow');
  }
  
  return true;
}

async function testAchievementSystem() {
  log('\n🏆 Testing Achievement System...', 'cyan');
  
  // Test 1: Create first lesson progress
  log('\nTest 1: First Lesson Achievement', 'blue');
  const progress1 = new Progress({
    userId: TEST_USER_ID,
    lessonId: 'test-lesson-1',
    status: 'completed',
    score: 100,
    maxScore: 100,
    timeSpent: 300,
    attempts: 1
  });
  await progress1.save();
  
  const achievements1 = await checkAchievements(TEST_USER_ID, { progress: progress1 });
  
  if (achievements1.length > 0) {
    log(`✓ Earned ${achievements1.length} achievement(s):`, 'green');
    achievements1.forEach(a => {
      log(`  - ${a.title}: ${a.description} (+${a.xp} XP)`, 'green');
    });
  } else {
    log('  No achievements earned yet', 'yellow');
  }
  
  // Test 2: Perfect score achievement
  log('\nTest 2: Perfect Score Achievement', 'blue');
  const progress2 = new Progress({
    userId: TEST_USER_ID,
    lessonId: 'test-lesson-2',
    status: 'completed',
    score: 100,
    maxScore: 100,
    timeSpent: 200,
    attempts: 1
  });
  await progress2.save();
  
  const achievements2 = await checkAchievements(TEST_USER_ID, { progress: progress2 });
  
  if (achievements2.length > 0) {
    log(`✓ Earned ${achievements2.length} achievement(s):`, 'green');
    achievements2.forEach(a => {
      log(`  - ${a.title}: ${a.description} (+${a.xp} XP)`, 'green');
    });
  }
  
  // Test 3: Multiple lessons for milestone achievement
  log('\nTest 3: Multiple Lessons Achievement', 'blue');
  for (let i = 3; i <= 5; i++) {
    const progress = new Progress({
      userId: TEST_USER_ID,
      lessonId: `test-lesson-${i}`,
      status: 'completed',
      score: 85,
      maxScore: 100,
      timeSpent: 250,
      attempts: 2
    });
    await progress.save();
  }
  
  const achievements3 = await checkAchievements(TEST_USER_ID);
  
  if (achievements3.length > 0) {
    log(`✓ Earned ${achievements3.length} achievement(s):`, 'green');
    achievements3.forEach(a => {
      log(`  - ${a.title}: ${a.description} (+${a.xp} XP)`, 'green');
    });
  }
  
  return true;
}

async function testStreakSystem() {
  log('\n🔥 Testing Streak System...', 'cyan');
  
  // Test 1: First activity
  log('\nTest 1: First Activity', 'blue');
  const stats1 = await updateStreak(TEST_USER_ID);
  
  if (stats1) {
    log(`✓ Streak initialized: ${stats1.currentStreak} day(s)`, 'green');
    log(`  Longest streak: ${stats1.longestStreak} day(s)`, 'green');
  } else {
    log('✗ Failed to update streak', 'red');
    return false;
  }
  
  // Test 2: Same day activity (should not change)
  log('\nTest 2: Same Day Activity', 'blue');
  const stats2 = await updateStreak(TEST_USER_ID);
  
  if (stats2.currentStreak === stats1.currentStreak) {
    log(`✓ Streak unchanged (same day): ${stats2.currentStreak} day(s)`, 'green');
  } else {
    log('⚠ Streak changed unexpectedly', 'yellow');
  }
  
  return true;
}

async function testProgressUpdate() {
  log('\n📝 Testing Progress Update with XP...', 'cyan');
  
  // Simulate what happens when user completes a lesson
  log('\nSimulating lesson completion...', 'blue');
  
  const progress = new Progress({
    userId: TEST_USER_ID,
    lessonId: 'test-lesson-complete',
    status: 'completed',
    score: 100,
    maxScore: 100,
    timeSpent: 600,
    attempts: 1,
    exercisesCompleted: ['ex1', 'ex2', 'ex3']
  });
  
  await progress.save();
  await updateStreak(TEST_USER_ID);
  
  // Award XP for lesson
  const xpLesson = await awardXP(TEST_USER_ID, XP_REWARDS.LESSON_COMPLETE, 'Lesson completed');
  log(`✓ Lesson XP: +${xpLesson.xpAwarded}`, 'green');
  
  // Award XP for perfect score
  const xpPerfect = await awardXP(TEST_USER_ID, XP_REWARDS.PERFECT_SCORE, 'Perfect score');
  log(`✓ Perfect score bonus: +${xpPerfect.xpAwarded}`, 'green');
  
  // Award XP for first try
  const xpFirstTry = await awardXP(TEST_USER_ID, XP_REWARDS.FIRST_TRY, 'First try');
  log(`✓ First try bonus: +${xpFirstTry.xpAwarded}`, 'green');
  
  // Award XP for practice exercises
  const xpPractice = await awardXP(TEST_USER_ID, XP_REWARDS.PRACTICE_COMPLETE * 3, '3 exercises');
  log(`✓ Practice exercises: +${xpPractice.xpAwarded}`, 'green');
  
  const totalXP = xpLesson.xpAwarded + xpPerfect.xpAwarded + xpFirstTry.xpAwarded + xpPractice.xpAwarded;
  log(`\n✓ Total XP earned: ${totalXP}`, 'green');
  log(`  New total XP: ${xpPractice.totalXP}`, 'green');
  log(`  Current level: ${xpPractice.newLevel}`, 'green');
  
  // Check for achievements
  const achievements = await checkAchievements(TEST_USER_ID, { progress });
  if (achievements.length > 0) {
    log(`\n✓ Achievements unlocked: ${achievements.length}`, 'green');
    achievements.forEach(a => {
      log(`  🏆 ${a.title} (+${a.xp} XP)`, 'green');
    });
  }
  
  return true;
}

async function displayFinalStats() {
  log('\n📈 Final Test User Stats:', 'cyan');
  
  const stats = await UserStats.findOne({ userId: TEST_USER_ID });
  const achievements = await Achievement.find({ userId: TEST_USER_ID });
  const progress = await Progress.find({ userId: TEST_USER_ID });
  
  if (stats) {
    const levelProgress = stats.getLevelProgress();
    log(`\nUser: ${TEST_USER_ID}`, 'blue');
    log(`Level: ${levelProgress.level}`, 'green');
    log(`Total XP: ${stats.totalXP}`, 'green');
    log(`XP to next level: ${levelProgress.xpToNextLevel}`, 'green');
    log(`Current streak: ${stats.currentStreak} day(s)`, 'green');
    log(`Longest streak: ${stats.longestStreak} day(s)`, 'green');
    log(`Lessons completed: ${stats.totalLessonsCompleted}`, 'green');
    log(`Practice completed: ${stats.totalPracticeCompleted}`, 'green');
    log(`Quizzes completed: ${stats.totalQuizzesCompleted}`, 'green');
  }
  
  log(`\nAchievements earned: ${achievements.length}`, 'green');
  achievements.forEach(a => {
    log(`  🏆 ${a.title} (${a.rarity}) - ${a.xp} XP`, 'green');
  });
  
  log(`\nProgress records: ${progress.length}`, 'green');
}

async function runTests() {
  log('🧪 Starting XP & Achievement System Tests\n', 'cyan');
  log('='.repeat(50), 'cyan');
  
  // Connect to database
  const connected = await connectDB();
  if (!connected) {
    log('\n❌ Cannot run tests without database connection', 'red');
    process.exit(1);
  }
  
  try {
    // Clean up any existing test data
    await cleanup();
    
    // Run tests
    await testXPSystem();
    await testAchievementSystem();
    await testStreakSystem();
    await testProgressUpdate();
    
    // Display final stats
    await displayFinalStats();
    
    log('\n' + '='.repeat(50), 'cyan');
    log('✅ All tests completed successfully!', 'green');
    log('\n💡 Tip: Check MongoDB to see the data:', 'yellow');
    log('   - UserStats collection', 'yellow');
    log('   - Achievement collection', 'yellow');
    log('   - Progress collection', 'yellow');
    
    // Ask if user wants to keep test data
    log('\n🗑️  Test data will remain in database for inspection.', 'yellow');
    log(`   User ID: ${TEST_USER_ID}`, 'yellow');
    log('   Run this script again to create new test data.', 'yellow');
    
  } catch (error) {
    log(`\n❌ Test failed: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await mongoose.connection.close();
    log('\n👋 Database connection closed', 'cyan');
  }
}

// Run the tests
runTests();
