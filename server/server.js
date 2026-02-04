const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const initScheduler = require('./cron/scheduler');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with detailed logging
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habitflow';

console.log('\n🔄 Attempting to connect to MongoDB...');
// Log using the same logic as test-connection.js to verify it's identical
console.log('📝 Connection String:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
console.log('📍 Database: habitflow');

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('╔════════════════════════════════════════╗');
        console.log('║  ✅ MongoDB Connected Successfully!   ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('📊 Database Name:', mongoose.connection.name);
        console.log('🔗 Host:', mongoose.connection.host);
        console.log('✨ All data will be stored in MongoDB Atlas!\n');

        // Init Scheduler only after DB is connected
        initScheduler();
    })
    .catch(err => {
        console.log('╔════════════════════════════════════════╗');
        console.log('║  ❌ MongoDB Connection Failed!        ║');
        console.log('╚════════════════════════════════════════╝');
        console.error('Error:', err.message);
        console.dir(err); // Print full error object
        console.log('\n🚨 ACTION REQUIRED:');
        console.log('   1. Check your internet connection');
        console.log('   2. Verify your IP is whitelisted in MongoDB Atlas');
        console.log('   3. Check if your connection string is correct\n');
    });

// Routes Placeholder
app.get('/', (req, res) => {
    const connectionStatus = mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌';
    res.json({
        message: 'HabitFlow API is Running',
        mongodb: connectionStatus,
        database: mongoose.connection.name || 'Not connected',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        uptime: process.uptime()
    });
});

// Import Routes
const userRoutes = require('./routes/users');
const habitRoutes = require('./routes/habits');
const examRoutes = require('./routes/exams');
const planRoutes = require('./routes/plans');
const taskRoutes = require('./routes/tasks');
const socialRoutes = require('./routes/social');

app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/social', socialRoutes);

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log(`║  🚀 Server running on port ${PORT}      ║`);
    console.log('╚════════════════════════════════════════╝');
    console.log(`📡 API URL: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/api/health\n`);
});
