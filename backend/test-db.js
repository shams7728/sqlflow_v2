#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connections...\n');

  const connectionOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
  };

  // Test Atlas connection
  if (process.env.MONGO_URI) {
    console.log('🔄 Testing MongoDB Atlas...');
    try {
      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      console.log('✅ MongoDB Atlas: Connected successfully!');
      await mongoose.disconnect();
      return true;
    } catch (error) {
      console.log('❌ MongoDB Atlas: Failed');
      console.log('   Error:', error.message);
    }
  }

  // Test local connection
  if (process.env.MONGO_URI_LOCAL) {
    console.log('\n🔄 Testing Local MongoDB...');
    try {
      await mongoose.connect(process.env.MONGO_URI_LOCAL, connectionOptions);
      console.log('✅ Local MongoDB: Connected successfully!');
      await mongoose.disconnect();
      return true;
    } catch (error) {
      console.log('❌ Local MongoDB: Failed');
      console.log('   Error:', error.message);
    }
  }

  console.log('\n❌ All database connections failed');
  console.log('\n💡 Solutions:');
  console.log('   1. Check MongoDB Atlas cluster status');
  console.log('   2. Verify network access in Atlas');
  console.log('   3. Install local MongoDB');
  console.log('   4. Use Docker: docker run -d -p 27017:27017 mongo');
  
  return false;
}

// Run the test
testDatabaseConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 Database connection successful!');
      process.exit(0);
    } else {
      console.log('\n⚠️  No database connection available');
      console.log('   Your app will still work for SQL learning!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });