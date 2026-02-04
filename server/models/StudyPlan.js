const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    date: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
