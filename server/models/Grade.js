const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },

    subject: { type: String, required: true },
    examName: { type: String, required: true },
    examDate: { type: Date },

    // Grade details
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentage: { type: Number },
    grade: { type: String }, // A, B, C, etc.

    // Additional info
    notes: { type: String },
    studyHours: { type: Number }, // Linked from study sessions

    createdAt: { type: Date, default: Date.now }
});

// Calculate percentage before saving
GradeSchema.pre('save', function (next) {
    if (this.score && this.maxScore) {
        this.percentage = (this.score / this.maxScore) * 100;
    }
    next();
});

module.exports = mongoose.model('Grade', GradeSchema);
