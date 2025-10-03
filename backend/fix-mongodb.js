#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 MongoDB Connection Fix Tool\n');

// Read current .env file
const envPath = path.join(__dirname, '.env');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('❌ Could not read .env file');
  process.exit(1);
}

console.log('Current MongoDB configuration:');
const mongoLines = envContent.split('\n').filter(line => 
  line.includes('MONGO_URI') || line.includes('mongodb')
);
mongoLines.forEach(line => console.log(`  ${line}`));

console.log('\n🛠️  Applying fixes...\n');

// Fix 1: Update Atlas connection string
let updatedContent = envContent.replace(
  /MONGO_URI=mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)\?(.+)/,
  'MONGO_URI=mongodb+srv://$1:$2@$3/$4?retryWrites=true&w=majority&appName=SQLFlow&connectTimeoutMS=10000&serverSelectionTimeoutMS=10000'
);

// Fix 2: Update local connection
updatedContent = updatedContent.replace(
  /MONGO_URI_LOCAL=mongodb:\/\/localhost:27017\/(.+)/,
  'MONGO_URI_LOCAL=mongodb://127.0.0.1:27017/$1'
);

// Fix 3: Add backup connection options
if (!updatedContent.includes('MONGO_URI_BACKUP')) {
  updatedContent += '\n# Backup MongoDB options\nMONGO_URI_BACKUP=mongodb://127.0.0.1:27017/sqlflow\n';
}

// Write updated .env file
try {
  fs.writeFileSync(envPath, updatedContent);
  console.log('✅ Updated .env file with improved MongoDB settings');
} catch (error) {
  console.log('❌ Could not update .env file:', error.message);
  process.exit(1);
}

console.log('\n📋 Next steps:');
console.log('1. Restart your backend server: npm start');
console.log('2. Test the connection: npm run test-db');
console.log('3. If still failing, try: docker run -d -p 27017:27017 mongo');
console.log('4. Or check MongoDB Atlas network access settings');

console.log('\n💡 Quick MongoDB setup with Docker:');
console.log('   docker run -d -p 27017:27017 --name sqlflow-mongo mongo:latest');

console.log('\n🎯 Your SQL-Flow app works great even without MongoDB!');
console.log('   Core SQL learning features are always available.');