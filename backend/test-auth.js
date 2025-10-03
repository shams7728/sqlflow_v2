const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testAuth() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URI_LOCAL);
        console.log('✅ Connected to MongoDB');

        // Test creating a user
        const testUser = new User({
            email: 'test@example.com',
            password: 'hashedpassword123',
            name: 'Test User'
        });

        await testUser.save();
        console.log('✅ Test user created:', testUser);

        // Test finding the user
        const foundUser = await User.findOne({ email: 'test@example.com' });
        console.log('✅ Test user found:', {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            registeredAt: foundUser.registeredAt
        });

        // Clean up
        await User.deleteOne({ email: 'test@example.com' });
        console.log('✅ Test user cleaned up');

        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testAuth();