const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function viewUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...\n');
    
    // Try local connection first
    const mongoUri = process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/sqlflow';
    await mongoose.connect(mongoUri);
    
    console.log('✅ Connected to MongoDB\n');
    console.log('=' .repeat(60));
    console.log('📊 USER DATA VIEWER');
    console.log('=' .repeat(60));
    console.log();

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available Collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log();

    // View Users
    const usersCollection = mongoose.connection.db.collection('users');
    const users = await usersCollection.find({}).toArray();
    
    console.log('=' .repeat(60));
    console.log(`👥 USERS (${users.length} total)`);
    console.log('=' .repeat(60));
    
    if (users.length === 0) {
      console.log('   No users found. Create an account to see data here.');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Guest: ${user.isGuest ? 'Yes' : 'No'}`);
        console.log(`   Created: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'}`);
        console.log(`   Password: ${user.password ? '****** (hashed)' : 'Not set'}`);
      });
    }
    console.log();

    // View User Stats
    const statsCollection = mongoose.connection.db.collection('userstats');
    const stats = await statsCollection.find({}).toArray();
    
    console.log('=' .repeat(60));
    console.log(`📈 USER STATS (${stats.length} total)`);
    console.log('=' .repeat(60));
    
    if (stats.length === 0) {
      console.log('   No stats found. Complete lessons to generate stats.');
    } else {
      stats.forEach((stat, index) => {
        console.log(`\n${index + 1}. User: ${stat.userId}`);
        console.log(`   Level: ${stat.level || 1}`);
        console.log(`   Total XP: ${stat.totalXP || 0}`);
        console.log(`   Current Streak: ${stat.currentStreak || 0} days`);
        console.log(`   Longest Streak: ${stat.longestStreak || 0} days`);
        console.log(`   Lessons Completed: ${stat.lessonsCompleted || 0}`);
        console.log(`   Practice Completed: ${stat.practiceCompleted || 0}`);
        console.log(`   Quizzes Completed: ${stat.quizzesCompleted || 0}`);
        console.log(`   Last Activity: ${stat.lastActivity ? new Date(stat.lastActivity).toLocaleString() : 'Never'}`);
      });
    }
    console.log();

    // View Achievements
    const achievementsCollection = mongoose.connection.db.collection('achievements');
    const achievements = await achievementsCollection.find({}).toArray();
    
    console.log('=' .repeat(60));
    console.log(`🏆 ACHIEVEMENTS (${achievements.length} total)`);
    console.log('=' .repeat(60));
    
    if (achievements.length === 0) {
      console.log('   No achievements unlocked yet.');
    } else {
      // Group by user
      const achievementsByUser = {};
      achievements.forEach(ach => {
        if (!achievementsByUser[ach.userId]) {
          achievementsByUser[ach.userId] = [];
        }
        achievementsByUser[ach.userId].push(ach);
      });

      Object.keys(achievementsByUser).forEach((userId, index) => {
        console.log(`\n${index + 1}. User: ${userId}`);
        console.log(`   Achievements: ${achievementsByUser[userId].length}`);
        achievementsByUser[userId].forEach(ach => {
          console.log(`   🏆 ${ach.title} (${ach.rarity || 'common'}) - ${ach.xpReward || 0} XP`);
          console.log(`      ${ach.description || 'No description'}`);
          console.log(`      Earned: ${ach.earnedAt ? new Date(ach.earnedAt).toLocaleString() : 'Unknown'}`);
        });
      });
    }
    console.log();

    // View Progress
    const progressCollection = mongoose.connection.db.collection('progress');
    const progress = await progressCollection.find({}).toArray();
    
    console.log('=' .repeat(60));
    console.log(`📚 LESSON PROGRESS (${progress.length} total)`);
    console.log('=' .repeat(60));
    
    if (progress.length === 0) {
      console.log('   No progress records found.');
    } else {
      // Group by user
      const progressByUser = {};
      progress.forEach(prog => {
        if (!progressByUser[prog.userId]) {
          progressByUser[prog.userId] = [];
        }
        progressByUser[prog.userId].push(prog);
      });

      Object.keys(progressByUser).forEach((userId, index) => {
        console.log(`\n${index + 1}. User: ${userId}`);
        console.log(`   Progress Records: ${progressByUser[userId].length}`);
        progressByUser[userId].slice(0, 5).forEach(prog => {
          console.log(`   📖 ${prog.lessonId}`);
          console.log(`      Status: ${prog.status || 'unknown'}`);
          console.log(`      Score: ${prog.score || 0}/${prog.maxScore || 100}`);
          console.log(`      Time: ${prog.timeSpent || 0}s`);
          console.log(`      Attempts: ${prog.attempts || 0}`);
        });
        if (progressByUser[userId].length > 5) {
          console.log(`   ... and ${progressByUser[userId].length - 5} more`);
        }
      });
    }
    console.log();

    // Summary
    console.log('=' .repeat(60));
    console.log('📊 SUMMARY');
    console.log('=' .repeat(60));
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Stats Records: ${stats.length}`);
    console.log(`Total Achievements: ${achievements.length}`);
    console.log(`Total Progress Records: ${progress.length}`);
    console.log();

    // Database info
    const dbStats = await mongoose.connection.db.stats();
    console.log('💾 Database Info:');
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   Collections: ${dbStats.collections}`);
    console.log(`   Data Size: ${(dbStats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`   Storage Size: ${(dbStats.storageSize / 1024).toFixed(2)} KB`);
    console.log();

    console.log('=' .repeat(60));
    console.log('✅ Data view complete!');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the viewer
viewUsers();
