const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String }, // For authentication

    // Gamification
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    achievements: [{ type: String }], // Achievement IDs
    unlockedRewards: [{ type: String }],

    // Preferences
    theme: { type: String, default: 'light' }, // light, dark, custom
    customTheme: {
        primary: String,
        secondary: String,
        background: String,
        text: String
    },
    fontSize: { type: String, default: 'medium' }, // small, medium, large

    // Notifications
    notificationPreferences: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        dailySummary: { type: Boolean, default: true },
        streakWarnings: { type: Boolean, default: true }
    },
    reminderTimes: [{ type: String }], // Array of times like ['09:00', '18:00']

    // Social
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    joinedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
