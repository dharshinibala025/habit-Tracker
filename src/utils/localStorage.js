// Centralized localStorage utility for Habit Tracker

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Generic localStorage helpers
const getItem = (key, defaultValue = []) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
};

// Users
export const getUsers = () => {
    return getItem('habitflow_users', []);
};

export const saveUsers = (users) => {
    setItem('habitflow_users', users);
};

export const createUser = (name) => {
    const users = getUsers();
    const newUser = {
        _id: generateId(),
        name,
        createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return newUser;
};

export const deleteUser = (userId) => {
    // Delete user from users list
    const users = getUsers();
    const updatedUsers = users.filter(u => u._id !== userId);
    saveUsers(updatedUsers);

    // Delete all user's data
    localStorage.removeItem(`habits_${userId}`);
    localStorage.removeItem(`tasks_${userId}`);
    localStorage.removeItem(`exams_${userId}`);
    localStorage.removeItem(`plans_${userId}`);

    // Clear current user if it's the deleted one
    const currentUser = JSON.parse(localStorage.getItem('habitflow_current_user') || 'null');
    if (currentUser && currentUser._id === userId) {
        localStorage.removeItem('habitflow_current_user');
    }
};


// Habits
export const getHabits = (userId) => {
    return getItem(`habits_${userId}`, []);
};

export const saveHabits = (userId, habits) => {
    setItem(`habits_${userId}`, habits);
};

export const createHabit = (userId, name, description) => {
    const habits = getHabits(userId);
    const newHabit = {
        _id: generateId(),
        userId,
        name,
        description,
        completedDates: [],
        createdAt: new Date().toISOString()
    };
    const updatedHabits = [newHabit, ...habits];
    saveHabits(userId, updatedHabits);
    return newHabit;
};

export const deleteHabit = (userId, habitId) => {
    const habits = getHabits(userId);
    const updatedHabits = habits.filter(h => h._id !== habitId);
    saveHabits(userId, updatedHabits);
};

export const toggleHabit = (userId, habitId, date) => {
    const habits = getHabits(userId);
    const updatedHabits = habits.map(habit => {
        if (habit._id === habitId) {
            const isCompleted = habit.completedDates.includes(date);
            const newDates = isCompleted
                ? habit.completedDates.filter(d => d !== date)
                : [...habit.completedDates, date];
            return { ...habit, completedDates: newDates };
        }
        return habit;
    });
    saveHabits(userId, updatedHabits);
    return updatedHabits.find(h => h._id === habitId);
};

// Special Tasks
export const getTasks = (userId) => {
    return getItem(`tasks_${userId}`, []);
};

export const saveTasks = (userId, tasks) => {
    setItem(`tasks_${userId}`, tasks);
};

export const createTask = (userId, text) => {
    const tasks = getTasks(userId);
    const newTask = {
        _id: generateId(),
        userId,
        text,
        done: false,
        createdAt: new Date().toISOString()
    };
    const updatedTasks = [...tasks, newTask];
    saveTasks(userId, updatedTasks);
    return newTask;
};

export const updateTask = (userId, taskId, text) => {
    const tasks = getTasks(userId);
    const updatedTasks = tasks.map(t => t._id === taskId ? { ...t, text } : t);
    saveTasks(userId, updatedTasks);
    return updatedTasks.find(t => t._id === taskId);
};

export const toggleTask = (userId, taskId) => {
    const tasks = getTasks(userId);
    const updatedTasks = tasks.map(t => t._id === taskId ? { ...t, done: !t.done } : t);
    saveTasks(userId, updatedTasks);
    return updatedTasks.find(t => t._id === taskId);
};

export const deleteTask = (userId, taskId) => {
    const tasks = getTasks(userId);
    const updatedTasks = tasks.filter(t => t._id !== taskId);
    saveTasks(userId, updatedTasks);
};

// Exams
export const getExams = (userId) => {
    return getItem(`exams_${userId}`, []);
};

export const saveExams = (userId, exams) => {
    setItem(`exams_${userId}`, exams);
};

export const createExam = (userId, subject, date, type) => {
    const exams = getExams(userId);
    const newExam = {
        _id: generateId(),
        userId,
        subject,
        date,
        type,
        createdAt: new Date().toISOString()
    };
    const updatedExams = [...exams, newExam].sort((a, b) => new Date(a.date) - new Date(b.date));
    saveExams(userId, updatedExams);
    return newExam;
};

export const deleteExam = (userId, examId) => {
    const exams = getExams(userId);
    const updatedExams = exams.filter(e => e._id !== examId);
    saveExams(userId, updatedExams);
};

// Study Plans
export const getPlans = (userId) => {
    return getItem(`plans_${userId}`, []);
};

export const savePlans = (userId, plans) => {
    setItem(`plans_${userId}`, plans);
};

export const createPlan = (userId, subject, topic, date) => {
    const plans = getPlans(userId);
    const newPlan = {
        _id: generateId(),
        userId,
        subject,
        topic,
        date,
        completed: false,
        createdAt: new Date().toISOString()
    };
    const updatedPlans = [...plans, newPlan].sort((a, b) => new Date(a.date) - new Date(b.date));
    savePlans(userId, updatedPlans);
    return newPlan;
};

export const togglePlan = (userId, planId) => {
    const plans = getPlans(userId);
    const updatedPlans = plans.map(p => p._id === planId ? { ...p, completed: !p.completed } : p);
    savePlans(userId, updatedPlans);
    return updatedPlans.find(p => p._id === planId);
};

export const deletePlan = (userId, planId) => {
    const plans = getPlans(userId);
    const updatedPlans = plans.filter(p => p._id !== planId);
    savePlans(userId, updatedPlans);
};
