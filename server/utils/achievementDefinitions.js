// Achievement definitions for backend
const achievementDefinitions = {
    first_habit: {
        id: 'first_habit',
        name: 'Getting Started',
        description: 'Create your first habit',
        icon: '🌱',
        category: 'milestone',
        points: 10
    },
    week_streak: {
        id: 'week_streak',
        name: 'Week Champion',
        description: 'Maintain a 7-day streak',
        icon: '⭐',
        category: 'streak',
        points: 50
    },
    month_streak: {
        id: 'month_streak',
        name: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        icon: '🏆',
        category: 'streak',
        points: 200
    },
    perfect_week: {
        id: 'perfect_week',
        name: 'Perfect Week',
        description: 'Complete all habits for 7 days straight',
        icon: '💯',
        category: 'consistency',
        points: 75
    },
    habits_10: {
        id: 'habits_10',
        name: 'Habit Collector',
        description: 'Create 10 habits',
        icon: '📚',
        category: 'milestone',
        points: 50
    }
};

module.exports = { achievementDefinitions };
