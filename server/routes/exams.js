const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// Get exams for a user
router.get('/:userId', async (req, res) => {
    try {
        const exams = await Exam.find({ userId: req.params.userId }).sort({ date: 1 });
        res.json(exams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create exam
router.post('/', async (req, res) => {
    const { userId, subject, date, type } = req.body;
    try {
        const newExam = new Exam({ userId, subject, date, type });
        await newExam.save();
        res.status(201).json(newExam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete exam
router.delete('/:id', async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.params.id);
        res.json({ message: 'Exam deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
