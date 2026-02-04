// Gamification utility functions
import { achievementDefinitions, calculateLevel, getNextLevelPoints } from '../data/achievements';

export const calculatePoints = (action) => {
    const pointsMap = {
        habit_completed: 10,
        habit_created: 5,
        streak_day: 5,
        perfect_day: 20,
        friend_added: 10,
        challenge_joined: 15,
        challenge_completed: 50,
        study_session: 15,
        exam_completed: 25
    };

    return pointsMap[action] || 0;
};

export const checkAchievements = (userData, habitData) => {
    const unlockedAchievements = [];

    // Check each achievement condition
    Object.values(achievementDefinitions).forEach(achievement => {
        // Skip if already unlocked
        if (userData.achievements?.includes(achievement.id)) {
            return;
        }

        let unlocked = false;

        switch (achievement.id) {
            case 'first_habit':
                unlocked = habitData.totalHabits >= 1;
                break;
            case 'day_3_streak':
                unlocked = habitData.longestStreak >= 3;
                break;
            case 'week_streak':
                unlocked = habitData.longestStreak >= 7;
                break;
            case 'month_streak':
                unlocked = habitData.longestStreak >= 30;
                break;
            case 'hundred_day_streak':
                unlocked = habitData.longestStreak >= 100;
                break;
            case 'perfect_week':
                unlocked = habitData.perfectDays >= 7;
                break;
            case 'perfect_month':
                unlocked = habitData.perfectDays >= 30;
                break;
            case 'habits_10':
                unlocked = habitData.totalHabits >= 10;
                break;
            case 'habits_25':
                unlocked = habitData.totalHabits >= 25;
                break;
            case 'completions_100':
                unlocked = habitData.totalCompletions >= 100;
                break;
            case 'completions_500':
                unlocked = habitData.totalCompletions >= 500;
                break;
            case 'first_friend':
                unlocked = userData.friends?.length >= 1;
                break;
            default:
                break;
        }

        if (unlocked) {
            unlockedAchievements.push(achievement);
        }
    });

    return unlockedAchievements;
};

export const getLevelProgress = (points) => {
    const currentLevel = calculateLevel(points);
    const nextLevelPoints = getNextLevelPoints(points);

    if (!nextLevelPoints) {
        return { level: currentLevel, progress: 100, pointsToNext: 0 };
    }

    const currentLevelThreshold = calculateLevel(points - 1);
    const currentLevelPoints = currentLevelThreshold === currentLevel
        ? points
        : points - (nextLevelPoints - points);

    const progress = ((points % nextLevelPoints) / nextLevelPoints) * 100;
    const pointsToNext = nextLevelPoints - points;

    return {
        level: currentLevel,
        progress: Math.min(progress, 100),
        pointsToNext: Math.max(pointsToNext, 0),
        nextLevelPoints
    };
};

export const getStreakInfo = (completedDates) => {
    if (!completedDates || completedDates.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    const sortedDates = [...completedDates].sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check current streak
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
        currentStreak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            const diffDays = Math.floor((prevDate - currDate) / 86400000);

            if (diffDays === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.floor((prevDate - currDate) / 86400000);

        if (diffDays === 1) {
            tempStreak++;
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
};
