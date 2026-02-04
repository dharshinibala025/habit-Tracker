const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    achievementId: { type: String, required: true }, // e.g., 'first_habit', 'week_streak', 'month_streak'
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    category: { type: String }, // streak, consistency, milestone, social
    unlockedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 100 }, // Percentage for progressive achievements
    metadata: {
        streakDays: Number,
        habitsCompleted: Number,
        pointsEarned: Number
    }
});

module.exports = mongoose.model('Achievement', AchievementSchema);
