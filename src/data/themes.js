// Theme configurations for the app
export const themes = {
    light: {
        name: 'Light',
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#f8f9fa',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    },
    dark: {
        name: 'Dark',
        primary: '#818cf8',
        secondary: '#a78bfa',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        border: '#334155',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
        info: '#60a5fa'
    },
    ocean: {
        name: 'Ocean',
        primary: '#0ea5e9',
        secondary: '#06b6d4',
        background: '#f0f9ff',
        surface: '#ffffff',
        text: '#0c4a6e',
        textSecondary: '#475569',
        border: '#bae6fd',
        success: '#14b8a6',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#0ea5e9'
    },
    sunset: {
        name: 'Sunset',
        primary: '#f97316',
        secondary: '#ec4899',
        background: '#fff7ed',
        surface: '#ffffff',
        text: '#7c2d12',
        textSecondary: '#78716c',
        border: '#fed7aa',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#f97316'
    },
    forest: {
        name: 'Forest',
        primary: '#059669',
        secondary: '#84cc16',
        background: '#f0fdf4',
        surface: '#ffffff',
        text: '#064e3b',
        textSecondary: '#475569',
        border: '#bbf7d0',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#059669'
    },
    midnight: {
        name: 'Midnight',
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#020617',
        surface: '#0f172a',
        text: '#e2e8f0',
        textSecondary: '#94a3b8',
        border: '#1e293b',
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        info: '#3b82f6'
    }
};

export const getTheme = (themeName) => {
    return themes[themeName] || themes.light;
};

export const applyTheme = (theme) => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
        if (key !== 'name') {
            root.style.setProperty(`--color-${key}`, value);
        }
    });
};
