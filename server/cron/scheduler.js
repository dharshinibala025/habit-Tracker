const cron = require('node-cron');
const User = require('../models/User');
const Habit = require('../models/Habit');
const emailService = require('../services/emailService');

const initScheduler = () => {
    console.log('Initializing Cron Scheduler...');

    // 1. Daily Summary (Runs every day at 8:00 AM)
    cron.schedule('0 8 * * *', async () => {
        console.log('Running 8:00 AM Daily Summary Job...');
        try {
            const users = await User.find({ 'notificationPreferences.dailySummary': true });

            for (const user of users) {
                const habits = await Habit.find({ userId: user._id });
                await emailService.sendDailySummary(user, habits);
            }
        } catch (err) {
            console.error('Error in daily summary job:', err);
        }
    });

    // 2. Reminder Check (Runs every hour)
    cron.schedule('0 * * * *', async () => {
        const currentHour = new Date().getHours();
        // Format: "09:00"
        const timeString = `${currentHour.toString().padStart(2, '0')}:00`;

        console.log(`Running Hourly Reminder Job for ${timeString}...`);

        try {
            const users = await User.find({
                'notificationPreferences.push': true,
                reminderTimes: timeString
            });

            for (const user of users) {
                // Determine if they have pending habits
                const habits = await Habit.find({ userId: user._id });
                const pending = habits.filter(h => !h.completedDates.includes(new Date().toISOString().split('T')[0]));

                if (pending.length > 0) {
                    await emailService.sendEmail(
                        user.email,
                        'Time to focus!',
                        `<p>Hi ${user.name}, you have ${pending.length} habits pending for today. It's ${timeString}, time to check in!</p>`
                    );
                }
            }
        } catch (err) {
            console.error('Error in hourly reminder job:', err);
        }
    });

    // 3. Streak Warning (Runs every day at 20:00 / 8 PM)
    cron.schedule('0 20 * * *', async () => {
        console.log('Running 8:00 PM Streak Warning Job...');
        try {
            const users = await User.find({ 'notificationPreferences.streakWarnings': true });

            for (const user of users) {
                const habits = await Habit.find({ userId: user._id });
                // Find habits with high streaks (e.g., > 3) that are NOT completed today
                const today = new Date().toISOString().split('T')[0];

                const atRiskHabits = habits.filter(h => {
                    const isCompleted = h.completedDates.includes(today);
                    // Simple streak check - logic mimicking frontend for now
                    const streak = h.completedDates.length; // Simplified
                    return !isCompleted && streak >= 3;
                });

                if (atRiskHabits.length > 0) {
                    // Send warning for the most important one
                    await emailService.sendStreakWarning(user, atRiskHabits[0]);
                }
            }
        } catch (err) {
            console.error('Error in streak warning job:', err);
        }
    });
};

module.exports = initScheduler;
