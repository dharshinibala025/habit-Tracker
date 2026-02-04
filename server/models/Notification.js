const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // reminder, achievement, streak_warning, friend_request, challenge
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    actionUrl: { type: String }, // Link to relevant page
    metadata: {
        habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit' },
        achievementId: String,
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date } // Auto-delete old notifications
});

module.exports = mongoose.model('Notification', NotificationSchema);
