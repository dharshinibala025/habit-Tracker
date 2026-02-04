const mongoose = require('mongoose');

const SpecialTaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    done: { type: Boolean, default: false }
});

module.exports = mongoose.model('SpecialTask', SpecialTaskSchema);
