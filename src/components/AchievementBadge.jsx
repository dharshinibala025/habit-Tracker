import React from 'react';
import PropTypes from 'prop-types';
import { Trophy, Star, Award, Target } from 'lucide-react';
import { achievementDefinitions } from '../data/achievements';

const AchievementBadge = ({ achievementId, size = 'medium', showDetails = true, unlocked = true }) => {
    const achievement = achievementDefinitions[achievementId];

    if (!achievement) return null;

    const sizeClasses = {
        small: 'w-12 h-12 text-xl',
        medium: 'w-16 h-16 text-2xl',
        large: 'w-24 h-24 text-4xl'
    };

    const categoryIcons = {
        streak: Trophy,
        consistency: Star,
        milestone: Award,
        social: Target,
        special: Star
    };

    const CategoryIcon = categoryIcons[achievement.category] || Award;

    return (
        <div className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'} fade-in`}>
            <div className={`achievement-icon ${sizeClasses[size]} ${!unlocked ? 'grayscale opacity-40' : ''}`}>
                <div className="icon-wrapper">
                    <span className="achievement-emoji">{achievement.icon}</span>
                    {unlocked && (
                        <div className="achievement-glow"></div>
                    )}
                </div>
            </div>

            {showDetails && (
                <div className="achievement-details">
                    <div className="achievement-header">
                        <h4 className="achievement-name">{achievement.name}</h4>
                        <CategoryIcon size={14} className="category-icon" />
                    </div>
                    <p className="achievement-description">{achievement.description}</p>
                    <div className="achievement-points">
                        <Star size={12} fill="currentColor" />
                        <span>{achievement.points} points</span>
                    </div>
                </div>
            )}

            <style jsx>{`
        .achievement-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--bg-card);
          border: 2px solid var(--border-light);
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
        }

        .achievement-badge.unlocked {
          border-color: var(--primary);
          box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2);
        }

        .achievement-badge:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .achievement-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-wrapper {
          position: relative;
        }

        .achievement-emoji {
          font-size: inherit;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .achievement-glow {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
          opacity: 0.3;
          animation: pulse 2s ease-in-out infinite;
          z-index: -1;
        }

        .achievement-details {
          text-align: center;
          width: 100%;
        }

        .achievement-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .achievement-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          margin: 0;
        }

        .category-icon {
          color: var(--text-muted);
        }

        .achievement-description {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0 0 0.5rem 0;
        }

        .achievement-points {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary);
        }

        .grayscale {
          filter: grayscale(100%);
        }

        .opacity-40 {
          opacity: 0.4;
        }
      `}</style>
        </div>
    );
};

AchievementBadge.propTypes = {
    achievementId: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    showDetails: PropTypes.bool,
    unlocked: PropTypes.bool
};

export default AchievementBadge;
