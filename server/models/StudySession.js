const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },

    subject: { type: String, required: true },
    topic: { type: String },

    // Session details
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number }, // in minutes

    // Pomodoro tracking
    pomodorosCompleted: { type: Number, default: 0 },
    breaks: { type: Number, default: 0 },

    // Notes
    notes: { type: String },
    resources: [{ type: String }], // URLs or resource names

    // Productivity
    focusRating: { type: Number, min: 1, max: 5 }, // Self-rated focus level

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudySession', StudySessionSchema);
