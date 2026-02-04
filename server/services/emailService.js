const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
// If credentials are provided in .env, use them. Otherwise, mock it.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    // If no credentials, log to console (Simulation Mode)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('=================================================');
        console.log(`[EMAIL SIMULATION]`);
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(`CONTENT:`);
        console.log(html.replace(/<[^>]*>?/gm, '')); // Strip HTML for readable log
        console.log('=================================================');
        return true;
    }

    try {
        await transporter.sendMail({
            from: `"HabitFlow" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

const sendDailySummary = async (user, habits) => {
    const pendingHabits = habits.filter(h =>
        !h.completedDates.includes(new Date().toISOString().split('T')[0])
    );

    if (pendingHabits.length === 0) return;

    const subject = `Daily Summary: You have ${pendingHabits.length} habits left!`;
    const html = `
        <h1>Hi ${user.name},</h1>
        <p>You're doing great! Here is what's left for today:</p>
        <ul>
            ${pendingHabits.map(h => `<li>${h.name}</li>`).join('')}
        </ul>
        <p>Keep the streak alive!</p>
        <p>- Team HabitFlow</p>
    `;

    await sendEmail(user.email || 'user@example.com', subject, html);
};

const sendStreakWarning = async (user, habit) => {
    const subject = `⚠️ Streak Risk: ${habit.name}`;
    const html = `
        <h1>Don't lose your streak!</h1>
        <p>Hi ${user.name}, you haven't completed <strong>${habit.name}</strong> today yet.</p>
        <p>Complete it now to keep your momentum going!</p>
    `;

    await sendEmail(user.email || 'user@example.com', subject, html);
};

module.exports = {
    sendEmail,
    sendDailySummary,
    sendStreakWarning
};
