import { quotes } from '../data/quotes';

export const getDailyQuote = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);

    // Use the day number to select a quote index
    const index = day % quotes.length;
    return quotes[index];
};
