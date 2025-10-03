const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User'); // Note the path change to ../

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false,
                msg: 'Database connection unavailable. Please try again later.' 
            });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ 
            email, 
            password,
            name: name || email.split('@')[0] // Use provided name or email prefix
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    location: user.location || '',
                    bio: user.bio || '',
                    createdAt: user.createdAt
                }
            });
        });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).json({ 
            success: false,
            msg: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false,
                msg: 'Database connection unavailable. Please try again later.' 
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name || user.email.split('@')[0], // Use name or email prefix
                    location: user.location || '',
                    bio: user.bio || '',
                    createdAt: user.createdAt
                }
            });
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ 
            success: false,
            msg: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', auth, async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false,
                msg: 'Database connection unavailable. Please try again later.' 
            });
        }

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name || user.email.split('@')[0],
                location: user.location || '',
                bio: user.bio || '',
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error('Get user error:', err.message);
        res.status(500).json({ 
            success: false,
            msg: 'Server error getting user',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false,
                msg: 'Database connection unavailable. Please try again later.' 
            });
        }

        const { name, location, bio } = req.body;

        // Build profile object
        const profileFields = {};
        if (name !== undefined) profileFields.name = name.trim();
        if (location !== undefined) profileFields.location = location.trim();
        if (bio !== undefined) profileFields.bio = bio.trim();

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: 'User not found' 
            });
        }

        res.json({
            success: true,
            msg: 'Profile updated successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name || user.email.split('@')[0],
                location: user.location || '',
                bio: user.bio || '',
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).json({ 
            success: false,
            msg: 'Server error updating profile',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

module.exports = router;
