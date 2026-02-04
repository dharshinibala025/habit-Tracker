const express = require('express');
const router = express.Router();
const StudyPlan = require('../models/StudyPlan');

// Get plans for a user
router.get('/:userId', async (req, res) => {
    try {
        const plans = await StudyPlan.find({ userId: req.params.userId }).sort({ date: 1 });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create plan
router.post('/', async (req, res) => {
    const { userId, subject, topic, date } = req.body;
    try {
        const newPlan = new StudyPlan({ userId, subject, topic, date });
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Toggle complete
router.patch('/:id/toggle', async (req, res) => {
    try {
        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        plan.completed = !plan.completed;
        await plan.save();
        res.json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete plan
router.delete('/:id', async (req, res) => {
    try {
        await StudyPlan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Plan deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
