import { format, subDays, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const getTodayISO = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const formatDate = (dateString) => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;

  // Sort dates descending (newest first)
  const sortedDates = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
  const today = getTodayISO();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  let streak = 0;
  let currentDate = new Date();

  // Check if today is completed
  const isTodayCompleted = sortedDates.includes(today);

  // If not completed today, we start checking from yesterday to see if the streak is alive
  if (!isTodayCompleted) {
    // If yesterday is also not done, streak is broken (0)
    if (!sortedDates.includes(yesterday)) {
      return 0;
    }
    currentDate = subDays(currentDate, 1);
  }

  // Iterate backwards day by day
  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    if (sortedDates.includes(dateStr)) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getCompletionPercentage = (habits) => {
  if (habits.length === 0) return 0;
  const today = getTodayISO();
  const completedCount = habits.filter(h => h.completedDates.includes(today)).length;
  return Math.round((completedCount / habits.length) * 100);
};

// Helper to get max streak within a set of days
export const calculateMaxStreakInRange = (completedDates, monthDays) => {
  if (!completedDates || completedDates.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 0;

  // Iterate through the days of the month in order
  monthDays.forEach(day => {
    if (completedDates.includes(day)) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  });

  return maxStreak;
};

export const getLast7Days = () => {
  return Array.from({ length: 7 })
    .map((_, i) => {
      const d = subDays(new Date(), i);
      return format(d, 'yyyy-MM-dd');
    })
    .reverse();
};

export const getMonthDays = (referenceDate = new Date()) => {
  const start = startOfMonth(referenceDate);
  const end = endOfMonth(referenceDate);

  return eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'));
};

export const getMonthName = (date = new Date()) => format(date, 'MMMM');
export const getYear = (date = new Date()) => format(date, 'yyyy');
