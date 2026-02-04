// Achievement definitions
export const achievementDefinitions = {
    // Streak achievements
    first_habit: {
        id: 'first_habit',
        name: 'Getting Started',
        description: 'Create your first habit',
        icon: '🌱',
        category: 'milestone',
        points: 10
    },
    day_3_streak: {
        id: 'day_3_streak',
        name: '3-Day Warrior',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        category: 'streak',
        points: 25
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
    hundred_day_streak: {
        id: 'hundred_day_streak',
        name: 'Centurion',
        description: 'Maintain a 100-day streak',
        icon: '👑',
        category: 'streak',
        points: 500
    },

    // Consistency achievements
    perfect_week: {
        id: 'perfect_week',
        name: 'Perfect Week',
        description: 'Complete all habits for 7 days straight',
        icon: '💯',
        category: 'consistency',
        points: 75
    },
    perfect_month: {
        id: 'perfect_month',
        name: 'Flawless Month',
        description: 'Complete all habits for 30 days straight',
        icon: '💎',
        category: 'consistency',
        points: 300
    },

    // Milestone achievements
    habits_10: {
        id: 'habits_10',
        name: 'Habit Collector',
        description: 'Create 10 habits',
        icon: '📚',
        category: 'milestone',
        points: 50
    },
    habits_25: {
        id: 'habits_25',
        name: 'Habit Master',
        description: 'Create 25 habits',
        icon: '🎓',
        category: 'milestone',
        points: 100
    },
    completions_100: {
        id: 'completions_100',
        name: 'Century Club',
        description: 'Complete 100 habit instances',
        icon: '💪',
        category: 'milestone',
        points: 150
    },
    completions_500: {
        id: 'completions_500',
        name: 'Elite Performer',
        description: 'Complete 500 habit instances',
        icon: '🌟',
        category: 'milestone',
        points: 400
    },

    // Social achievements
    first_friend: {
        id: 'first_friend',
        name: 'Social Butterfly',
        description: 'Add your first friend',
        icon: '👥',
        category: 'social',
        points: 20
    },
    join_challenge: {
        id: 'join_challenge',
        name: 'Challenge Accepted',
        description: 'Join your first challenge',
        icon: '🎯',
        category: 'social',
        points: 30
    },
    win_challenge: {
        id: 'win_challenge',
        name: 'Challenge Champion',
        description: 'Win a challenge',
        icon: '🥇',
        category: 'social',
        points: 100
    },

    // Special achievements
    early_bird: {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete habits before 8 AM for 7 days',
        icon: '🌅',
        category: 'special',
        points: 75
    },
    night_owl: {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete habits after 10 PM for 7 days',
        icon: '🦉',
        category: 'special',
        points: 75
    },
    comeback_kid: {
        id: 'comeback_kid',
        name: 'Comeback Kid',
        description: 'Rebuild a streak after breaking it',
        icon: '🔄',
        category: 'special',
        points: 50
    }
};

export const levelThresholds = [
    { level: 1, points: 0 },
    { level: 2, points: 100 },
    { level: 3, points: 250 },
    { level: 4, points: 500 },
    { level: 5, points: 1000 },
    { level: 6, points: 1750 },
    { level: 7, points: 2750 },
    { level: 8, points: 4000 },
    { level: 9, points: 5500 },
    { level: 10, points: 7500 },
    { level: 11, points: 10000 },
    { level: 12, points: 13000 },
    { level: 13, points: 16500 },
    { level: 14, points: 20500 },
    { level: 15, points: 25000 }
];

export const calculateLevel = (points) => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (points >= levelThresholds[i].points) {
            return levelThresholds[i].level;
        }
    }
    return 1;
};

export const getNextLevelPoints = (currentPoints) => {
    const currentLevel = calculateLevel(currentPoints);
    const nextLevel = levelThresholds.find(l => l.level === currentLevel + 1);
    return nextLevel ? nextLevel.points : null;
};
