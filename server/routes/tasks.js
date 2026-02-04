const express = require('express');
const router = express.Router();
const SpecialTask = require('../models/SpecialTask');

// Get tasks for a user
router.get('/:userId', async (req, res) => {
    try {
        const tasks = await SpecialTask.find({ userId: req.params.userId }).sort({ _id: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create task
router.post('/', async (req, res) => {
    const { userId, text } = req.body;
    try {
        const newTask = new SpecialTask({ userId, text });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Toggle done
router.patch('/:id/toggle', async (req, res) => {
    try {
        const task = await SpecialTask.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.done = !task.done;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update text
router.patch('/:id', async (req, res) => {
    const { text } = req.body;
    try {
        const task = await SpecialTask.findByIdAndUpdate(req.params.id, { text }, { new: true });
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        await SpecialTask.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
