const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log('🔄 Testing MongoDB connections...\n');

    // Test Atlas connection
    if (process.env.MONGO_URI) {
        console.log('Testing Atlas connection...');
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000,
            });
            console.log('✅ MongoDB Atlas connected successfully!');
            console.log('📊 Database:', mongoose.connection.db.databaseName);
            await mongoose.disconnect();
        } catch (error) {
            console.log('❌ Atlas connection failed:', error.message);
        }
    }

    // Test local connection
    if (process.env.MONGO_URI_LOCAL) {
        console.log('\nTesting local MongoDB connection...');
        try {
            await mongoose.connect(process.env.MONGO_URI_LOCAL, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000,
            });
            console.log('✅ Local MongoDB connected successfully!');
            console.log('📊 Database:', mongoose.connection.db.databaseName);
            await mongoose.disconnect();
        } catch (error) {
            console.log('❌ Local connection failed:', error.message);
        }
    }

    console.log('\n🏁 Connection test completed!');
    process.exit(0);
}

testConnection().catch(console.error);