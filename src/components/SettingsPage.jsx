import React, { useState } from 'react';
import { Settings as SettingsIcon, Palette, Bell, Type, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeSelector from './ThemeSelector';
import NotificationSettings from './NotificationSettings';

const SettingsPage = ({ user, onUpdateUser }) => {
  const { currentTheme, fontSize, changeFontSize, changeTheme } = useTheme();

  const isDarkMode = currentTheme === 'dark' || currentTheme === 'midnight';

  return (
    <div className="settings-page">
      <div className="settings-header">
        <SettingsIcon size={32} />
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        {/* Theme Settings */}
        <section className="settings-section">
          <div className="section-header">
            <Palette size={20} />
            <h2>Appearance</h2>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <span>Dark Mode</span>
              <button
                className="toggle-btn"
                onClick={() => changeTheme(isDarkMode ? 'light' : 'dark')}
              >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                <span>{isDarkMode ? 'Dark' : 'Light'}</span>
              </button>
            </label>
          </div>

          <ThemeSelector />
        </section>

        {/* Font Size */}
        <section className="settings-section">
          <div className="section-header">
            <Type size={20} />
            <h2>Font Size</h2>
          </div>

          <div className="font-size-options">
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                className={`font-size-btn ${fontSize === size ? 'active' : ''}`}
                onClick={() => changeFontSize(size)}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Notification Settings */}
        <section className="settings-section">
          {user ? (
            <NotificationSettings user={user} onUpdateUser={onUpdateUser} />
          ) : (
            <div>Please log in to manage notifications.</div>
          )}
        </section>
      </div>


      <style jsx>{`
        .settings-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .settings-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: var(--primary);
        }

        .settings-header h1 {
          margin: 0;
          font-size: 2rem;
        }

        .settings-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-section {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }

        .section-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .setting-item {
          margin-bottom: 1rem;
        }

        .setting-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 500;
          color: var(--text-main);
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          transition: all var(--transition-base);
        }

        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .font-size-options {
          display: flex;
          gap: 1rem;
        }

        .font-size-btn {
          flex: 1;
          padding: 0.75rem;
          background: var(--bg-subtle);
          border: 2px solid var(--border-light);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          color: var(--text-main);
          transition: all var(--transition-base);
        }

        .font-size-btn:hover {
          border-color: var(--primary);
        }

        .font-size-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .notification-settings {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          transition: background var(--transition-base);
        }

        .checkbox-label:hover {
          background: var(--bg-subtle);
        }

        .checkbox-input {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: var(--primary);
        }

        .checkbox-text {
          font-weight: 500;
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
