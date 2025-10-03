const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Export all user data to JSON file
async function exportUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/sqlflow';
    await mongoose.connect(mongoUri);
    
    console.log('✅ Connected to MongoDB');
    console.log('📦 Exporting data...\n');

    const exportData = {
      exportDate: new Date().toISOString(),
      database: mongoose.connection.db.databaseName,
      collections: {}
    };

    // Export Users
    const usersCollection = mongoose.connection.db.collection('users');
    const users = await usersCollection.find({}).toArray();
    exportData.collections.users = users.map(user => ({
      ...user,
      password: user.password ? '***HIDDEN***' : null // Hide passwords in export
    }));
    console.log(`✓ Exported ${users.length} users`);

    // Export User Stats
    const statsCollection = mongoose.connection.db.collection('userstats');
    const stats = await statsCollection.find({}).toArray();
    exportData.collections.userstats = stats;
    console.log(`✓ Exported ${stats.length} user stats`);

    // Export Achievements
    const achievementsCollection = mongoose.connection.db.collection('achievements');
    const achievements = await achievementsCollection.find({}).toArray();
    exportData.collections.achievements = achievements;
    console.log(`✓ Exported ${achievements.length} achievements`);

    // Export Progress
    const progressCollection = mongoose.connection.db.collection('progress');
    const progress = await progressCollection.find({}).toArray();
    exportData.collections.progress = progress;
    console.log(`✓ Exported ${progress.length} progress records`);

    // Save to file
    const filename = `user-data-export-${Date.now()}.json`;
    const filepath = path.join(__dirname, filename);
    fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));

    console.log(`\n✅ Data exported successfully!`);
    console.log(`📁 File: ${filepath}`);
    console.log(`📊 Total records: ${users.length + stats.length + achievements.length + progress.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the export
exportUsers();
