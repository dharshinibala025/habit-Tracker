const mongoose = require('mongoose');

const HabitTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    icon: { type: String },
    color: { type: String },

    // Suggested settings
    suggestedFrequency: {
        type: { type: String, default: 'daily' },
        daysOfWeek: [{ type: Number }],
        timesPerWeek: { type: Number }
    },

    // Popularity
    usageCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    // Template type
    isOfficial: { type: Boolean, default: false }, // Official vs user-created
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HabitTemplate', HabitTemplateSchema);
