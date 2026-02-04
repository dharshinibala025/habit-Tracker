const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// --- Friends ---

// Send Friend Request
router.post('/friends/request', async (req, res) => {
    const { fromId, toEmail } = req.body;
    try {
        const targetUser = await User.findOne({ email: toEmail });
        if (!targetUser) return res.status(404).json({ message: 'User not found' });
        if (targetUser._id.toString() === fromId) return res.status(400).json({ message: 'Cannot add yourself' });

        const isAlreadyRequested = targetUser.friendRequests.some(id => id.toString() === fromId);
        const isAlreadyFriends = targetUser.friends.some(id => id.toString() === fromId);

        if (isAlreadyRequested || isAlreadyFriends) {
            return res.status(400).json({ message: 'Request already sent or already friends' });
        }

        targetUser.friendRequests.push(fromId);
        await targetUser.save();
        res.json({ message: 'Friend request sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Accept Friend Request
router.post('/friends/accept', async (req, res) => {
    const { userId, requestId } = req.body; // userId is "me", requestId is "them"
    try {
        const me = await User.findById(userId);
        const them = await User.findById(requestId);

        if (!me || !them) return res.status(404).json({ message: 'User not found' });

        // Remove request
        me.friendRequests = me.friendRequests.filter(id => id.toString() !== requestId);

        // Add to friends lists
        if (!me.friends.includes(requestId)) me.friends.push(requestId);
        if (!them.friends.includes(userId)) them.friends.push(userId);

        await me.save();
        await them.save();

        res.json({ message: 'Friend request accepted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Friends List (with details)
router.get('/friends/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('friends', 'name email points level').populate('friendRequests', 'name email');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ friends: user.friends, requests: user.friendRequests });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// --- Challenges ---

// Create Challenge
router.post('/challenges', async (req, res) => {
    try {
        const newChallenge = new Challenge(req.body);
        // Add creator as participant
        newChallenge.participants.push({ userId: req.body.createdBy });
        await newChallenge.save();
        res.status(201).json(newChallenge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get All Public Challenges
router.get('/challenges', async (req, res) => {
    try {
        const challenges = await Challenge.find({ visibility: 'public' }).populate('createdBy', 'name').sort({ createdAt: -1 });
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Join Challenge
router.post('/challenges/:id/join', async (req, res) => {
    const { userId } = req.body;
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

        if (challenge.participants.some(p => p.userId.toString() === userId)) {
            return res.status(400).json({ message: 'Already joined' });
        }

        challenge.participants.push({ userId });
        await challenge.save();
        res.json(challenge);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
