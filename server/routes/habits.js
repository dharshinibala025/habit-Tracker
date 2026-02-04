const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// Get habits for a user
router.get('/:userId', async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(habits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create habit
router.post('/', async (req, res) => {
    // Destructure all possible fields from the request body
    const {
        userId,
        name,
        description,
        type,
        goal,
        unit,
        frequency,
        category,
        tags,
        color,
        icon,
        visibility
    } = req.body;

    try {
        const newHabit = new Habit({
            userId,
            name,
            description,
            type,
            goal,
            unit,
            frequency,
            category,
            tags,
            color,
            icon,
            visibility,
            completedDates: []
        });

        await newHabit.save();
        res.status(201).json(newHabit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Toggle habit completion
router.patch('/:id/toggle', async (req, res) => {
    const { date } = req.body; // 'YYYY-MM-DD'
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        const index = habit.completedDates.indexOf(date);
        if (index > -1) {
            habit.completedDates.splice(index, 1); // Remove
        } else {
            habit.completedDates.push(date); // Add
        }
        await habit.save();
        res.json(habit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete habit
router.delete('/:id', async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
