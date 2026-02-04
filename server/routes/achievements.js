const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const { achievementDefinitions } = require('../utils/achievementDefinitions');

// Get user achievements
router.get('/:userId', async (req, res) => {
    try {
        const achievements = await Achievement.find({ userId: req.params.userId });
        res.json(achievements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unlock achievement
router.post('/', async (req, res) => {
    const { userId, achievementId } = req.body;

    try {
        const achievementDef = achievementDefinitions[achievementId];
        if (!achievementDef) {
            return res.status(400).json({ message: 'Invalid achievement ID' });
        }

        // Check if already unlocked
        const existing = await Achievement.findOne({ userId, achievementId });
        if (existing) {
            return res.status(400).json({ message: 'Achievement already unlocked' });
        }

        const achievement = new Achievement({
            userId,
            achievementId,
            name: achievementDef.name,
            description: achievementDef.description,
            icon: achievementDef.icon,
            category: achievementDef.category
        });

        await achievement.save();

        // Update user points
        await User.findByIdAndUpdate(userId, {
            $inc: { points: achievementDef.points },
            $push: { achievements: achievementId }
        });

        res.status(201).json(achievement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
