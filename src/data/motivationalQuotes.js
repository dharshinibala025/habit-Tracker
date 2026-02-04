// Curated motivational quotes for different contexts
export const motivationalQuotes = {
    general: [
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Your limitation—it's only your imagination.", author: "Unknown" },
        { text: "Great things never come from comfort zones.", author: "Unknown" },
        { text: "Dream it. Wish it. Do it.", author: "Unknown" },
        { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
        { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" }
    ],

    streak: [
        { text: "You're on fire! Keep that streak alive!", author: "HabitFlow" },
        { text: "Consistency is the key to success. You're doing amazing!", author: "HabitFlow" },
        { text: "Every day you show up is a victory. Keep going!", author: "HabitFlow" },
        { text: "Your dedication is inspiring. Don't break the chain!", author: "HabitFlow" },
        { text: "Momentum is powerful. You've got this!", author: "HabitFlow" }
    ],

    motivation: [
        { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
        { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
        { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
        { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" }
    ],

    achievement: [
        { text: "Congratulations! You've earned this achievement!", author: "HabitFlow" },
        { text: "Your hard work is paying off. Well done!", author: "HabitFlow" },
        { text: "You're making incredible progress. Keep it up!", author: "HabitFlow" },
        { text: "Achievement unlocked! You're unstoppable!", author: "HabitFlow" }
    ],

    study: [
        { text: "Education is the passport to the future.", author: "Malcolm X" },
        { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
        { text: "Study while others are sleeping; work while others are loafing.", author: "William A. Ward" },
        { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
        { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" }
    ]
};

export const getRandomQuote = (category = 'general') => {
    const quotes = motivationalQuotes[category] || motivationalQuotes.general;
    return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getDailyQuote = () => {
    // Get a consistent quote for the day based on date
    const today = new Date().toDateString();
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const allQuotes = Object.values(motivationalQuotes).flat();
    return allQuotes[hash % allQuotes.length];
};
