import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { themes, applyTheme } from '../data/themes';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState('light');
    const [fontSize, setFontSize] = useState('medium');
    const [customTheme, setCustomTheme] = useState(null);

    // Load saved preferences from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('habitflow-theme') || 'light';
        const savedFontSize = localStorage.getItem('habitflow-fontSize') || 'medium';
        const savedCustomTheme = localStorage.getItem('habitflow-customTheme');

        setCurrentTheme(savedTheme);
        setFontSize(savedFontSize);
        if (savedCustomTheme) {
            setCustomTheme(JSON.parse(savedCustomTheme));
        }
    }, []);

    // Apply theme whenever it changes
    useEffect(() => {
        const theme = customTheme || themes[currentTheme];
        applyTheme(theme);

        // Apply dark mode class
        if (currentTheme === 'dark' || currentTheme === 'midnight') {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [currentTheme, customTheme]);

    // Apply font size
    useEffect(() => {
        document.documentElement.setAttribute('data-font-size', fontSize);
        localStorage.setItem('habitflow-fontSize', fontSize);
    }, [fontSize]);

    const changeTheme = (themeName) => {
        setCurrentTheme(themeName);
        setCustomTheme(null);
        localStorage.setItem('habitflow-theme', themeName);
        localStorage.removeItem('habitflow-customTheme');
    };

    const setCustomThemeColors = (colors) => {
        setCustomTheme(colors);
        setCurrentTheme('custom');
        localStorage.setItem('habitflow-theme', 'custom');
        localStorage.setItem('habitflow-customTheme', JSON.stringify(colors));
    };

    const changeFontSize = (size) => {
        setFontSize(size);
    };

    const value = {
        currentTheme,
        fontSize,
        customTheme,
        themes,
        changeTheme,
        setCustomThemeColors,
        changeFontSize
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
};
