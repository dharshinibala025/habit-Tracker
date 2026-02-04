const mongoose = require('mongoose');
const Habit = require('./models/Habit');
require('dotenv').config({ path: 'server/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habitflow';

async function testHabitCreation() {
    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');
    } catch (e) {
        console.error('Connection failed:', e);
        return;
    }

    const payload = {
        userId: new mongoose.Types.ObjectId(), // Generate valid ObjectId
        name: "Test Habit",
        description: "Test Description",
        type: "positive",
        goal: 1,
        unit: "times",
        frequency: {
            type: "daily",
            days: ["Mon"], // Even if daily, provide checking
            repeatEvery: 1
        },
        // Missing category/tags/etc to see if defaults work
        completedDates: []
    };

    console.log('Testing payload:', JSON.stringify(payload, null, 2));

    try {
        const habit = new Habit(payload);
        console.log('Model created. Validating...');
        await habit.validate();
        console.log('Validation SUCCESS!');

        // Optional: Try saving if validation passes (will just test schema)
        // await habit.save(); 
        // console.log('Save SUCCESS!');
    } catch (err) {
        console.error('Validation FAILED:', err.message);
        if (err.errors) {
            Object.keys(err.errors).forEach(key => {
                console.error(`Field '${key}': ${err.errors[key].message}`);
            });
        }
    } finally {
        await mongoose.disconnect();
    }
}

testHabitCreation();
