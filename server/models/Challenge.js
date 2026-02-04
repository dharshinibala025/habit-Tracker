const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Challenge details
    type: { type: String, required: true }, // streak, completion, custom
    targetHabit: { type: String }, // Habit name or category
    goal: {
        type: { type: String }, // days, completions, streak
        value: { type: Number, required: true }
    },

    // Timing
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Participants
    participants: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 },
        completed: { type: Boolean, default: false }
    }],

    // Settings
    visibility: { type: String, default: 'public' }, // public, private, friends
    maxParticipants: { type: Number },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
