const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../UI/uploads/avatars');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Complete user profile
router.post('/complete-profile', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        const {
            fullName,
            username,
            email,
            location,
            experienceLevel,
            interests,
            bio,
            goals,
            termsAccepted
        } = req.body;

        // Validate required fields
        if (!fullName || !username || !email || !experienceLevel) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        if (!termsAccepted) {
            return res.status(400).json({
                success: false,
                message: 'You must accept the terms and conditions'
            });
        }

        // Parse interests if it's a string
        const parsedInterests = typeof interests === 'string' ? JSON.parse(interests) : interests;

        // Get avatar path if uploaded
        const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

        // In a real app, save to database
        // For now, we'll return the user data
        const userData = {
            id: req.user.id || Date.now(),
            name: fullName,
            username: username,
            email: email,
            location: location || '',
            experienceLevel: experienceLevel,
            interests: parsedInterests || [],
            bio: bio || '',
            goals: goals || '',
            avatar: avatarPath,
            termsAccepted: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // TODO: Save to database
        // await db.users.update(req.user.id, userData);

        res.json({
            success: true,
            message: 'Profile completed successfully',
            user: userData
        });

    } catch (error) {
        console.error('Complete profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete profile',
            error: error.message
        });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        // TODO: Fetch from database
        // const user = await db.users.findById(req.user.id);
        
        // Mock data for now
        const user = {
            id: req.user.id,
            name: req.user.name || 'User',
            username: req.user.username || 'user',
            email: req.user.email,
            location: 'San Francisco, CA',
            experienceLevel: 'intermediate',
            interests: ['web', 'crypto'],
            bio: 'Cybersecurity enthusiast',
            goals: 'Master web security',
            avatar: null,
            createdAt: req.user.createdAt || new Date().toISOString(),
            stats: {
                challengesSolved: 42,
                totalPoints: 8750,
                globalRank: 127,
                dayStreak: 15
            },
            recentActivity: [
                {
                    icon: 'trophy',
                    title: 'Completed SQL Injection Challenge',
                    time: '2 hours ago'
                },
                {
                    icon: 'star',
                    title: 'Earned "Quick Learner" Badge',
                    time: '1 day ago'
                }
            ]
        };

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        const updates = req.body;
        
        if (req.file) {
            updates.avatar = `/uploads/avatars/${req.file.filename}`;
        }

        // TODO: Update in database
        // await db.users.update(req.user.id, updates);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updates
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

module.exports = router;
