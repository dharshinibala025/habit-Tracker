const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    completedDates: [{ type: String }], // Use ISO Date strings 'YYYY-MM-DD'

    // Advanced Management
    type: { type: String, enum: ['positive', 'negative'], default: 'positive' },
    goal: { type: Number, default: 1 }, // Target value (e.g. 30 mins)
    unit: { type: String, default: 'times' }, // e.g. 'mins', 'cups', 'pages'

    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    color: { type: String, default: '#6366f1' },
    icon: { type: String },

    // Frequency
    frequency: {
        type: { type: String, default: 'daily' }, // daily, weekly, specific_days
        days: [{ type: String }], // ['Mon', 'Wed', 'Fri']
        repeatEvery: { type: Number, default: 1 } // repeat every X days
    },

    // Social
    visibility: { type: String, default: 'private' }, // private, friends, public
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Dependencies
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],

    // Status
    archived: { type: Boolean, default: false },
    archivedAt: { type: Date },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Habit', HabitSchema);
