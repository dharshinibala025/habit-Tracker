const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true }, // ISO Date String
    type: { type: String, enum: ['Exam', 'Practical'], default: 'Exam' }
});

module.exports = mongoose.model('Exam', ExamSchema);
