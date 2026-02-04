import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../data/themes';

const ThemeSelector = () => {
    const { currentTheme, changeTheme } = useTheme();

    return (
        <div className="theme-selector">
            <h3 className="selector-title">Choose Theme</h3>
            <div className="theme-grid">
                {Object.entries(themes).map(([key, theme]) => (
                    <button
                        key={key}
                        className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                        onClick={() => changeTheme(key)}
                    >
                        <div className="theme-preview">
                            <div className="preview-colors">
                                <div
                                    className="color-swatch color-primary"
                                    style={{ background: theme.primary }}
                                />
                                <div
                                    className="color-swatch color-secondary"
                                    style={{ background: theme.secondary }}
                                />
                                <div
                                    className="color-swatch color-background"
                                    style={{ background: theme.background }}
                                />
                            </div>
                            {currentTheme === key && (
                                <div className="theme-check">
                                    <Check size={16} />
                                </div>
                            )}
                        </div>
                        <span className="theme-name">{theme.name}</span>
                    </button>
                ))}
            </div>

            <style jsx>{`
        .theme-selector {
          padding: 1.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
        }

        .selector-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          margin: 0 0 1rem 0;
        }

        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
        }

        .theme-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--bg-subtle);
          border: 2px solid var(--border-light);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .theme-option:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .theme-option.active {
          border-color: var(--primary);
          background: var(--primary-light);
        }

        .theme-preview {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .preview-colors {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          height: 100%;
          gap: 2px;
        }

        .color-swatch {
          width: 100%;
          height: 100%;
        }

        .theme-check {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          background: white;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .theme-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }
      `}</style>
        </div>
    );
};

ThemeSelector.propTypes = {};

export default ThemeSelector;
